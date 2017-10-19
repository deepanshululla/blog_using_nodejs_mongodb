#!/bin/bash

cp /opt/db/mongod.conf /etc/mongod.conf.orig && /usr/bin/mongod
echo "Starting Server..."
find /backups -mtime +7 -exec rm -rf {} \;
echo "Removing older backups"
mongodump --out /backups/`date +"%m-%d-%y"`
echo "Backed up DB"
