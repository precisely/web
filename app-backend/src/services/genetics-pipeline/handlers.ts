/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {log} from 'src/common/logger';
import {Handler, Context, Callback, S3CreateEvent} from 'aws-lambda';
import { getEnvVar } from 'src/common/environment';

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context, callback: Callback) => {
  // pass
};

function getUserEmailFromFilename(filename: string) {
  return getUserFromAuth0('dummyUserId').email;
}

function getUserFromAuth0(userId: string) {
  return {email: 'vishesh@causecode.com'};
}

export async function rawDataUpload(event: S3CreateEvent, context: Context, callback: Callback) {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const rawDataBucket = event.Records[0].s3.bucket.name;
    const rawDataFilename = event.Records[0].s3.object.key;

    const ecs = new AWS.ECS();

    const params: AWS.ECS.Types.RunTaskRequest = {
      cluster: getEnvVar('INGESTION_CLUSTER'),
      launchType: 'FARGATE',
      taskDefinition: getEnvVar('INGESTION_TASK_NAME'),
      count: 1,
      networkConfiguration: { // Despite this being present in ecs related yml forced to pass this
        awsvpcConfiguration: {
          subnets: [getEnvVar('SUBNET_ONE'), getEnvVar('SUBNET_TWO')],
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: process.env.INGESTION_CONTAINER_NAME,
            environment: [
              {
                name: 'S3_RAW_DATA_BUCKET',
                value: rawDataBucket
              },
              {
                name: 'S3_BUCKET_GENETICS_VCF',
                value: getEnvVar('S3_BUCKET_GENETICS_VCF')
              },
              {
                name: 'GENOTYPE_RAW_FILENAME',
                value: rawDataFilename
              },
              {
                name: 'S3_BUCKET_ERROR',
                value: getEnvVar('S3_BUCKET_INGESTION_ERROR')
              },
              {
                name: 'USER_EMAIL',
                value: getUserEmailFromFilename(rawDataFilename)
              }
            ]
          }
        ]
      }
    };

    await ecs.runTask(params).promise();
    log.info(`ECS TASK TRIGGERED FOR ${rawDataFilename}`);
  } catch (error) {
    log.error(`Error Occurred: ${error}`);
  }
}
