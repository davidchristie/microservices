#!/bin/bash

set -e

function graphql-healthcheck() {
  service-url=$1

  curl \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{ "query": "{ __schema { types { name } } }" }' \
    --output /dev/null \
    --fail \
    --silent \
    $service-url
}

function wait-for() {
  service-url=$1

  attempt_counter=0
  max_attempts=10

  until $(graphql-healthcheck $service-url) ; do

    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Max attempts reached"
      exit 1
    fi

    printf "."
    attempt_counter=$(($attempt_counter+1))
    sleep 5
  done
}

echo "Wait for accounts"
wait-for http://accounts:4000

echo "Wait for inventory"
wait-for http://inventory:4000

echo "Wait for products"
wait-for http://products:4000

echo "Wait for reviews"
wait-for http://reviews:4000
