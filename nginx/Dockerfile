FROM nginx:1.12.1
MAINTAINER Deepanshu Lulla <deepanshu.lulla@gmail.com>

RUN rm /usr/share/nginx/html/*
#remove sthe default nginx index page

COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf /etc/nginx/conf.d/default.conf
#copies over nginx config files. The nginx.conf file
#is the main conf file and goes in /etc/nginx/nginx.conf
#the /etc/nginx is the main conf directory and default.conf
#is used for setting up virtual hosts.

COPY /certs/productionexample.crt /etc/ssl/certs/productionexample.crt
COPY /certs/productionexample.key /etc/ssl/private/productionexample.key
COPY certs/dhparam.pem /etc/ssl/private/dhparam.pem

COPY docker-entrypoint /
RUN chmod +x /docker-entrypoint
ENTRYPOINT ["/docker-entrypoint"]
#docker entry point allows us to provide custom scripting before image gets built.
#docker-entrypoint is the bash script that is called

CMD ["nginx", "-g", "daemon off;"]
#we don't want nginx to run in background

