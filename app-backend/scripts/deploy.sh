#!/bin/sh
APPBACKEND_DIR=$(cd `dirname $0` && pwd)
JSON_FILE=${APPBACKEND_DIR}/serverless/generated/dynogels-tables.json
ts-node -r src/db/dynamo/
