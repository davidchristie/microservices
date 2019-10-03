#!/bin/bash

set -e

function graphql-healthcheck() {
  curl \
    --fail \
    --output /dev/null \
    --silent \
    $1
}

function wait-for() {
  attempt_counter=0
  max_attempts=1

  until $(graphql-healthcheck $1) ; do

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
wait-for http://accounts:4000/.well-known/apollo/server-health

echo "Wait for inventory"
wait-for http://inventory:4000/.well-known/apollo/server-health

echo "Wait for products"
wait-for http://products:4000/.well-known/apollo/server-health

echo "Wait for reviews"
wait-for http://reviews:4000/.well-known/apollo/server-health
