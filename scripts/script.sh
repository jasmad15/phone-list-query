#!/bin/bash

#obtenemos el timestamp

timestamp=`date "+%s"`
FILE=Lista_Blanca.txt

echo $timestamp

7za e $1 -p$2 

#ejecutamos la importación

mongoimport -d validador -c identification_$timestamp --type csv --file $3 --headerline


mongo validador --eval "db.identification_$timestamp.createIndex( { CIF_NIF: 1 } );"


#modificamos el fichero config.json
jq --arg timestamp "$timestamp" '.identification = identification_$timestamp' /usr/share/validador/config.json