/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {log} from 'src/common/logger';
import {Handler, Context, Callback, S3CreateEvent} from 'aws-lambda';
import { getEnvVar } from 'src/common/environment';

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context) => {
  // pass
};

export async function uploadProcessor(event: S3CreateEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const inputBucket = event.Records[0].s3.bucket.name;
    const inputFile = event.Records[0].s3.object.key;

    const ecs = new AWS.ECS();

    const params: AWS.ECS.Types.RunTaskRequest = {
      cluster: getEnvVar('ECS_BIOINFORMATICS_CLUSTER'),
      launchType: 'FARGATE',
      taskDefinition: getEnvVar('ECS_BIOINFORMATICS_TASK'),
      count: 1,
      networkConfiguration: { // Despite this being present in ecs related yml forced to pass this
        awsvpcConfiguration: {
          subnets: [getEnvVar('FULL_SUBNET')],
        }
      },
      overrides: {
        containerOverrides: [
          {
            environment: [
              // note to Constantine: name these env vars whatever you want
              //      they don't have any dependencies elsewhere
              {
                name: 'S3_INPUT_BUCKET',
                value: inputBucket
              },
              {
                name: 'S3_INPUT_FILE',
                value: inputFile
              },
              {
                name: 'S3_OUTPUT_VCF_BUCKET',
                value: getEnvVar('S3_BUCKET_BIOINFORMATICS_VCF')
              },
              {
                name: 'S3_ERROR_BUCKET',
                value: getEnvVar('S3_BUCKET_BIOINFORMATICS_ERROR')
              }
            ]
          }
        ]
      }
    };

    log.info(`Bioinformatics file upload processor triggered for ${inputFile}`);
    await ecs.runTask(params).promise();
  } catch (error) {
    log.error(`Error Occurred: ${error}`);
  }
}
