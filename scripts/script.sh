#!/bin/bash

#obtenemos el timestamp

timestamp=`date "+%s"`
FILE=valCurrentCollection.txt

echo $timestamp

7za e $1 -pTNP_Validador 

#ejecutamos la importación

mongoimport -d validador -c listin1 --type csv --file ListaValidadorJulio.txt --headerline

#guardamos el nombre de la colección en un fichero para la persistencia

#borramos el fichero si exite
rm $FILE

echo $timestamp >> $FILE

#modificamos el fichero config.json
jq --arg timestamp "$timestamp" '.collection = $timestamp' /usr/share/validador/config.json