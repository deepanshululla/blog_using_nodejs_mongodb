#!/bin/bash

/opt/letsencrypt/letsencrypt-auto --no-bootstrap renew && cp /etc/letsencrypt/live/blog.deepanshululla.com/fullchain.pem /home/ubuntu/blog_using_nodejs_mongodb/nginx/certs/productionexample.crt && cp /etc/letsencrypt/live/blog.deepanshululla.com/privkey.pem /home/ubuntu/blog_using_nodejs_mongodb/nginx/certs/productionexample.key && /home/ubuntu/blog_using_nodejs_mongodb/scripts/refresh_server.sh
