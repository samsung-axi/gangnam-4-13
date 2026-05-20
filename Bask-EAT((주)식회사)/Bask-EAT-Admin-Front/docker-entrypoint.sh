#!/usr/bin/env sh
set -eu
: "${PORT:=8080}"
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
