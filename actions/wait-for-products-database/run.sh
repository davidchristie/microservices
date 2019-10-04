#!/bin/bash

set -e

./actions/wait-for-healthcheck/run.sh \
  docker exec products-neo4j curl --fail --output /dev/null --silent localhost:7474
