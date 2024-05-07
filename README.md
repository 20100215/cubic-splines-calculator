# MAT 5101 - Cubic Splines Application

## Developers

- Wayne Matthew Dayata, Ivan Ric Woogue, Raymond Anthony Aya-Ay

## Technologies 

- Frontend/UI: Next.JS
- Backend/Server: R Plumber

## Features

- **Solve:** Creates the cubic spline polynomials from a given set of points that can be used for interpolation.
- **Plot:** Plots the formulated cubic spline polynomials based on the given set of points.
- **Predict:** Interpolates the cubic spline polynomials on a given value of x within the interval of the given points, and updates the graph showing the location of the predicted point.

## System Requirements

To run our application, ensure that **Docker Desktop** is installed on your Windows computer. 

Link to the download site is https://docs.docker.com/desktop/install/windows-install/.

## Running the System

Once Docker Desktop is downloaded, run the system using the `start.bat` file or execute the following command:
```
docker compose up --build
```