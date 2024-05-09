# MAT 5101 - Cubic Splines Application

![image](https://github.com/OG-Habit/mat5101/assets/84717650/38ca659a-5597-473f-9172-193b9c231aa2)

![image](https://github.com/OG-Habit/mat5101/assets/84717650/ce650a97-e2c5-4833-94ed-81bc92f336ed)

## Developers

- Wayne Matthew Dayata, Ivan Ric Woogue, Raymond Anthony Aya-ay

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

Clone the application by typing the following command line using Git Bash or Command Prompt:

```
git clone https://github.com/20100215/cubic-splines-calculator.git
```

Once Docker Desktop is downloaded, run the system using the `start.bat` file or execute the following command:
```
docker compose up --build
```
The frontend and backend areas of the app will begin building. This will last for around 3-5 minutes.

Once all the executions are complete, the following final line pops up:
```
final-project-mat5101-g1-frontend |  ✔ Ready in x.x s
```

You may now access the built application by typing [http://localhost:3000](http://localhost:3000) in the address bar of your browser.




