# plumber.R
require('plumber')
require('SciViews')
require('matlib')
require('dendextend')
suppressPackageStartupMessages(library(dendextend))

#* @apiTitle Cubic Splines
#* @apiDescription Cubic Splines

# Set port number
options("plumber.port" = 5555)

#' @filter cors
cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}

# Schemas
numlist <- list(0)

# Globals
a = c(); b = c(); c = c(); d = c();
diff = c(); h = c();
xlist = c(); ylist = c();
xmax = NULL; xmin = NULL;
n = 0; g = 0;
predx = NULL
predy = NULL

#* Solves a cubic spline
#* @serializer unboxedJSON
#* @post /solve
#* @param x:object  
#* @param y:object
function(res,x=numlist,y=numlist){
  
  # Initializations
  a <<- c(); b <<- c(); c <<- c(); d <<- c();
  diff <<- c(); h <<- c();
  xlist <<- c(); ylist <<- c();
  g <<- 0;
  predx <<- NULL;
  predy <<- NULL;
  
  # Unpack to list of x and y values: xlist, ylist
  xlist <<- unlist(x)
  ylist <<- unlist(y)
  
  # Number of points: n
  n <<- length(xlist)
  
  # Check if xlist is unique
  if(all_unique(xlist) == FALSE){
    return(list(
      "status" = "Fail",
      "message" = "X values are not unique."))
  }
  
  # Check if length of xlist and ylist are equal
  if(length(xlist) != length(ylist)){
    return(list(
      "status" = "Fail",
      "message" = "Length of x values and y values are not equal."))
  }
  
  # Sort the points according to x values
  order = order(xlist, decreasing = FALSE)
  xlist <<- sort(xlist, decreasing = FALSE)
  temp <- ylist
  for(i in 1:n){
    ylist[i] <<- temp[order[i]]
  }
  
  # Getting divided differences: diff, h
  for(i in 1:(n-1)){
    diff = c(diff, (ylist[i+1]-ylist[i])/(xlist[i+1]-xlist[i]))
    h = c(h,xlist[i+1]-xlist[i])
  }
  
  # Initializing the matrix A (in terms of h): a
  A = matrix(0, nrow=n-2, ncol=n-2)
    
  # Initializing the matrix B (in terms of divided differences): b
  B = matrix(0, nrow=n-2, ncol=1)

  # Populating first elements of A and B
  A[1,1] = 2*(h[1]+h[2])
  B[1] = diff[2]-diff[1]
  
  # Populating rest of elements of A and B via loop
  for(i in 2:(n-2)){
    A[i-1,i] = h[i]
    A[i,i-1] = h[i]
    A[i,i] = 2*(h[i]+h[i+1])
    B[i] = diff[i+1]-diff[i]
  }
  
  # Multiply B by 6
  B = B %*% 6
  
  # Solve the system to get S_1, ..., S_n-1: S
  S = solve(A,B)
  S = as.vector(S)
  
  # Insert S_0 and S_n (for a natural spline)
  S = c(0, S, 0)
  
  # Obtain a, b, c, d for rows from S_0 to S_n-1
  for(i in 1:(n-1)){
    a[i] <<- (S[i+1]-S[i])/(6*h[i])
    b[i] <<- S[i]/2
    c[i] <<- ((ylist[i+1]-ylist[i])/h[i]) - ((2*h[i]*S[i]+h[i]*S[i+1])/6)
    d[i] <<- ylist[i]
  }
  
  # Create the table
  table = data.frame(a, b, c, d, xlist[1:n-1], ylist[1:n-1], h, S[1:n-1])
  colnames(table) = c('a','b','c','d','x','y','h','S')

  
  # Return the values
  return(list(
    "status" = "Success",
    "n" = n, 
    "h" = h, 
    "d" = d,
    "A" = A,
    "B" = B,
    "S" = S,
    "table" = table))
}

#* Plot the graph
#* @serializer png
#* @get /plot
function() {
  
  # Check if there are already points given
  if(n==0){
    return(list(
      "status" = "Fail",
      "message" = "No points given for the spline."))
  }
  
  # Get range of the graph
  xmin <<- min(xlist) - diff(range(xlist))*0.1
  xmax <<- max(xlist) + diff(range(xlist))*0.1
  ymin = min(ylist) - diff(range(ylist))*0.1
  ymax = max(ylist) + diff(range(ylist))*0.1
  
  # Create a graph with interval [xmin, xmax]
  plot.new()
  plot(1, xlim=c(xmin,xmax), ylim=c(ymin,ymax), col="white")
  
  # loop through the splines from 1 to n-1
  for (i in 1:(n-1)){
    # Create polynomial g_i(x): g
    g = function(z){
        a[i]*(z-xlist[i])^3 + 
        b[i]*(z-xlist[i])^2 + 
        c[i]*(z-xlist[i]) + 
        d[i]
    }
    # Plot the curve
    curve(g, xlist[i], xlist[i+1], add=T)
  }
  
  # Highlight the predicted point, if exists
  if(!is.null(predx)){
    points(predx,predy,col="red",pch=19)
    abline(v=predx,col="red",lty=3)
    abline(h=predy,col="red",lty=3)
  }
  
  # Plot the bounds
  points(xlist,ylist,pch=19)
}


#* Predict the value of a cubic spline at x
#* @serializer unboxedJSON
#* @param val:numeric
#* @get /predict
function(val = 0.0) {
  
  # Initializations
  val = as.numeric(val)
  num = 0
  
  
  # Check if there are already points given
  if(n==0){
    return(list(
      "status" = "Fail",
      "message" = "No points given for the spline."))
  }
  
  # Check if val is within range
  if(val >= xmax){
    return(list(
      "status" = "Fail",
      "message" = "Value out of range from the given intervals."))
  }
  
  if(val <= xmin){
    return(list(
      "status" = "Fail",
      "message" = "Value out of range from the given intervals."))
  }

  
  # Determine which polynomial to predict on, g
  for(i in 1:(n-1)){
    if(val <= xlist[i+1]){
      num = i
      break
    }
  }
  if(num==0){
    num = n-1
  }
  g = num-1


  # Create the polynomial g_num(x): poly
  poly = function(z){
    a[num]*(z-xlist[num])^3 + 
    b[num]*(z-xlist[num])^2 + 
    c[num]*(z-xlist[num]) + 
    d[num]
  }
  
  # Save the predicted point
  predx <<- val
  predy <<- poly(val)
  
  # Predict and return the value
  return(list(
    "status" = "Success",
    "y" = poly(val),
    "g" = num - 1))
  
}
