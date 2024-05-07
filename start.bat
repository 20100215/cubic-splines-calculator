@echo off
color 0E
echo.
echo    =========================================
echo.
echo           MAT 5101 - Numerical Methods
echo             CUBIC SPLINES CALCULATOR
echo.
echo          By: Dayata, Woogue, and Aya-Ay   
echo                   May 7, 2024      
echo.            
echo    =========================================
echo.
echo.
echo Initializing...
timeout /t 3 /nobreak > NUL
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
  echo Starting Docker Desktop Service
  "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  timeout /t 5 /nobreak > NUL
) else (
  echo Please install Docker Desktop
  echo https://docs.docker.com/desktop/install/windows-install/
  pause
  exit
)
echo Preparing Files...
echo.
docker compose up --build
timeout /t 5 /nobreak > NUL
echo Status: Running
echo.
pause