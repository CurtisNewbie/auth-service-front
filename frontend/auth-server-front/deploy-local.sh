#!/bin/bash

ng build;
if [ $? -eq 0 ]; then
    cp -r ./dist/auth-service-web/* "/usr/share/nginx/html/auth-service-web/"
fi




