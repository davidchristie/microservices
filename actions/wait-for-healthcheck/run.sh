#!/bin/bash

set -e

function wait-for-healthcheck() {
  healthcheck=$@
  attempt_counter=0
  max_attempts=30
  
  until $healthcheck; do

    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Maximum attempts reached"
      exit 1
    fi

    echo "..."
    attempt_counter=$(($attempt_counter + 1))
    sleep 5
  done
  echo "Ready"
}

wait-for-healthcheck $@
