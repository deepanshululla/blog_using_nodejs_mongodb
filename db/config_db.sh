#!/bin/bash

cp /opt/db/mongod.conf /etc/mongod.conf.orig && /usr/bin/mongod && find /backups -mtime +7 -exec rm -rf {} && mongodump --out /backups/`date +"%m-%d-%y"` 
