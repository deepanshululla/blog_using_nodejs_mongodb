#!/bin/bash

(sudo docker-compose stop && sudo docker-compose rm -f) || (sudo docker rm $(docker ps -a | grep -v 'CONTAINER' |awk '{print $1}')) 
sudo docker rmi $(docker images| grep -v 'Repository' | awk '{print $3}')
sudo docker-compose up;
