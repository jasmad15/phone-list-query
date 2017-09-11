#!/bin/bash

#obtenemos el timestamp

timestamp=`date "+%s"`

echo $timestamp

#modificamos el fichero config.json
jq --arg timestamp "$timestamp" '.collection = $timestamp' /usr/share/validador/config.json

