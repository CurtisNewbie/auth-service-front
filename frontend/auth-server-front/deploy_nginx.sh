#!/bin/bash

remote="alphaboi@curtisnewbie.com"
remote_path="/home/alphaboi/services/nginx/html/"

# build angular
ng build --prod

# copy to nginx on remote server
scp -r "./dist/auth-service-web/" "${remote}:${remote_path}"


