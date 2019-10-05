#!/bin/bash

set -e

curl \
    --request PUT \
    --data "http://accounts:4000" \
    localhost:8500/v1/kv/gateway/services/accounts/url

curl \
    --request PUT \
    --data "http://inventory:4000" \
    localhost:8500/v1/kv/gateway/services/inventory/url

curl \
    --request PUT \
    --data "http://products:4000" \
    localhost:8500/v1/kv/gateway/services/products/url

curl \
    --request PUT \
    --data "http://reviews:4000" \
    localhost:8500/v1/kv/gateway/services/reviews/url
