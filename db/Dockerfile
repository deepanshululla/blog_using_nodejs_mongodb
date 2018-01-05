FROM mongo:3.6
COPY config_db /
COPY backup_db /
RUN chmod +x /config_db
RUN chmod +x /backup_db
CMD ['/config_db']
