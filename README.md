# MAT 5101 - Cubic Splines Application

## Developers

- Wayne Matthew Dayata, Ivan Ric Woogue, Raymond Anthony Aya-Ay

## Technologies 

- Frontend/UI: Next.JS
- Backend/Server: R Plumber

## Features/Endpoints

- **/Solve** Creates the cubic spline polynomials from a given set of points that can be used for interpolation. At least four (4) points are needed, and all the x-values should be unique.
- **/Plot** Plots the formulated cubic spline polynomials based on the given set of points. Can only be called after /Solve is called. 
- **/Predict** Interpolates the cubic spline polynomials on a given value of x within the interval of the given points, and updates the graph showing the location of the predicted point. Can only be called after /Solve is called.

## System Requirements

To run our application, ensure that **Docker Desktop** is installed on your Windows computer. 

Link to the download site is https://docs.docker.com/desktop/install/windows-install/.

## Running the System

Once Docker Desktop is downloaded, run the system using the `start.bat` file or execute the following command:
```
docker compose up --build
```
The frontend and backend areas of the app will begin building. This will last for around 3-5 minutes.

Once all the executions are complete, the following final line pops up:
```
mat5101-g1-frontend-1 |  ✔ Ready in x.x s
```

You may now access the built application by typing [http://localhost:3000](http://localhost:3000) in the address bar of your browser.
