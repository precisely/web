#!/usr/bin/env bash

set -e
set -o pipefail

PORT=${DYNAMODB_LOCAL_PORT:-8000}

if [[ $(uname) == "Darwin" ]]; then
    cmd="lsof -i :$PORT"
else
    cmd="netstat -t -l | grep $PORT"
fi
attempt=0
max_attempts=30
sleep_interval=1
while [[ ! $(${cmd}) ]]; do
    if [[ ! $(ps auwx | grep DynamoDBLocal_lib | grep -v 'grep DynamoDBLocal_lib') ]]; then
        echo "Local DynamoDB not started" 1>&2
        exit 1
    fi
    (( attempt += 1 ))
    if [[ ${attempt} -gt ${max_attempts} ]]; then
        echo "Local DynamoDB startup failed after ${max_attempts} waits of ${sleep_interval}sec each" 1>&2
        exit 1
    fi
    echo "waiting for DynamoDB local... ${attempt}/${max_attempts}"
    sleep ${sleep_interval}
done

echo "Local DynamoDB is running"
exit 0
