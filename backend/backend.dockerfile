FROM rocker/rstudio
LABEL org.opencontainers.image.authors="Docker User <docker@user.org>"

RUN R -e "install.packages(c('plumber','SciViews','matlib','dendextend'))"

EXPOSE 5555

COPY . /app

WORKDIR /app

ENTRYPOINT ["Rscript", "-e" , "library(plumber); plumb('cubic_splines_backend.R')$run(port=5555, host='0.0.0.0')"]