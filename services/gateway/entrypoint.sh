#!/bin/sh

set -e

npm ci
npm run wait-for-services
npm start
