# NOTE: this image has volume /var/lib/postgresql/data
FROM postgres:16-alpine

# copy files from machine to container
COPY init.sql /docker-entrypoint-initdb.d/
COPY quotes.csv /docker-entrypoint-initdb.d/

# set port
EXPOSE 5432
