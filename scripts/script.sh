#!/bin/bash

#obtenemos el timestamp
zipFile="tal"
timestamp=`date "+%s"`
FILE=valCurrentCollection.txt

echo $timestamp

7za e $1 -pTNP_Validador 

#ejecutamos la importación

mongoimport -d validador -c identification_$timestamp --type csv --file $FILE --headerline


mongo validador --eval "db.identification_%timespan1%.createIndex( { CIF_NIF: 1 } );"


#modificamos el fichero config.json
jq --arg timestamp "$timestamp" '.identification = identification_$timestamp' /usr/share/validador/config.json