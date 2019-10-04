#!/bin/bash

set -e

if [ -z "$NEO4J_USERNAME" ]; then
  echo "Required variable NEO4J_USERNAME is undefined"
  exit 1
fi

if [ -z "$NEO4J_PASSWORD" ]; then
  echo "Required variable NEO4J_PASSWORD is undefined"
  exit 1
fi

SCRIPT='CALL db.index.fulltext.createNodeIndex("products",["Product"],["name"])'

docker exec \
  products-neo4j \
  cypher-shell -u $NEO4J_USERNAME -p $NEO4J_PASSWORD "$SCRIPT"
