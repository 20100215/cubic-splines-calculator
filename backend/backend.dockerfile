FROM rstudio/plumber
LABEL org.opencontainers.image.authors="Docker User <docker@user.org>"

RUN R -e "install.packages(c('SciViews','matlib','dendextend'))"

COPY . /app

WORKDIR /app

ENTRYPOINT ["R"]

CMD ["cubic_splines_backend.R"]

EXPOSE 5555