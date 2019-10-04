#!/bin/bash

set -e

./actions/wait-for-healthcheck/run.sh \
  curl --fail -H "accept:text/html" --output /dev/null --silent localhost:4000
