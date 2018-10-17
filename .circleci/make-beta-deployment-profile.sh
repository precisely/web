#!/usr/bin/env bash 
set -eo pipefail

PROFILE="beta-profile-precisely"

aws configure set aws_access_key_id "$BETA_AWS_ACCESS_KEY_ID" --profile $PROFILE
aws configure set region $AWS_REGION --profile $PROFILE
aws configure set aws_secret_access_key  "$BETA_AWS_SECRET_KEY" --profile $PROFILE