#!/bin/bash

set -e

./actions/wait-for-healthcheck/run.sh \
  curl --fail --output /dev/null --silent localhost:3000
