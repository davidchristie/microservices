#!/bin/bash

set -e

DATA=$(cat actions/set-platform-consul-data/data.json)

curl \
    --request PUT \
    --data "$DATA" \
    localhost:8500/v1/txn
