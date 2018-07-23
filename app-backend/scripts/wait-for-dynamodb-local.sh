#!/usr/bin/env bash

set -e
set -o pipefail

if [[ ${UNAME} == "Darwin" ]]; then
    cmd="lsof -i :8000"
else
    cmd="netstat -t -l | grep 8000"
fi

attempt=0
max_attempts=30
sleep_interval=1
while [[ ! $(${cmd}) ]]; do
    if [[ ! $(ps auwx | grep DynamoDBLocal_lib | grep -v 'grep DynamoDBLocal_lib') ]]; then
        echo "local DynamoDB not started" 1>&2
        exit 1
    fi
    (( attempt += 1 ))
    if [[ ${attempt} -gt ${max_attempts} ]]; then
        echo "local DynamoDB startup failed after ${max_attempts} waits of ${sleep_interval}sec each" 1>&2
        exit 1
    fi
    echo "waiting for DynamoDB local... ${attempt}/${max_attempts}"
    sleep ${sleep_interval}
done

echo "local DynamoDB is running"
exit 0
