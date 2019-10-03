#!/bin/bash

set -e

function gateway-healthcheck() {
  curl \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{ "query": "{ me { id } }" }' \
    --output /dev/null \
    --fail \
    --silent \
    http://localhost:4000
}

function web-app-healthcheck() {
  curl \
    --header "Content-Type: text/html" \
    --request GET \
    --output /dev/null \
    --fail \
    --silent \
    http://localhost:3000
}

function wait-for() {

  healthcheck=$1

  attempt_counter=0
  max_attempts=30

  until $($healthcheck) ; do

    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Max attempts reached"
      exit 1
    fi

    printf "."
    attempt_counter=$(($attempt_counter+1))
    sleep 5
  done
}

echo "Wait for gateway"
wait-for gateway-healthcheck

echo "Wait for web app"
wait-for web-app-healthcheck
