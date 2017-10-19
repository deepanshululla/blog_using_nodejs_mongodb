#!/bin/bash

sudo docker-compose stop && sudo docker-compose rm -f && sudo docker rmi $(docker images| grep blog | awk '{print $3}') && sudo docker-compose up
