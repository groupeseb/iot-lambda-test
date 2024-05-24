#!/usr/bin/env bash

set -ex

env=$1
region=$2
stage=$3
lambdaName=$4

if [ -z "$lambdaName" ]
then
  echo "missing lambda name"
  exit 1
fi

echo "service: $lambdaName" > serverless.yml
cat serverless-template.yml >> serverless.yml

npm run deploy -- --aws-profile "$env" --region "$region" --stage "$stage"

rm serverless.yml
