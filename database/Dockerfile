# mount volume @ /var/lib/postgresql/data
FROM postgres:16-alpine

# note: the quote file directly from kaggle has a null field
#       if the field is not removed the image cannot be built
COPY quotes.csv /docker-entrypoint-initdb.d/

# copy initial script
COPY init.sql /docker-entrypoint-initdb.d/

# set port
EXPOSE 5432
