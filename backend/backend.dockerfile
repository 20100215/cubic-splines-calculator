FROM rstudio/plumber
LABEL org.opencontainers.image.authors="Docker User <docker@user.org>"

RUN R -e "install.packages(c('SciViews','matlib','dendextend'))"

EXPOSE 5555

COPY . /app

WORKDIR /app

ENTRYPOINT ["R", "launch.R"]