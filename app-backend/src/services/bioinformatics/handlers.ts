/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {log} from 'src/common/logger';
import {Handler, Context, Callback, S3CreateEvent, ScheduledEvent} from 'aws-lambda';
import { getEnvVar } from 'src/common/environment';

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context) => {
  // pass
};

function makeTaskParams(overrides: object): AWS.ECS.Types.RunTaskRequest {
  const base = {
    cluster: getEnvVar('CLUSTER'),
    launchType: 'FARGATE',
    taskDefinition: getEnvVar('TASK'),
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: [getEnvVar('SUBNET')],
        securityGroups: [getEnvVar('SECURITY_GROUP')]
      }
    }
  };
  const res: AWS.ECS.Types.RunTaskRequest = {...base, ...overrides};
  return res;
};

export async function updateAllUsersCallVariants(event: ScheduledEvent, context: Context) {
  try {
    let params = makeTaskParams({
      overrides: {
        containerOverrides: [
          {
            name: `${getEnvVar('STAGE')}-BioinformaticsECSContainer`,
            cpu: 512,
            memory: 2048,
            command: [
              "/bin/bash",
              "-c",
              `/precisely/app/run-remote-access.sh && /precisely/app/run-update.sh --data-source=23andme --stage=${getEnvVar('STAGE')} --test-mock-lambda=false --cleanup-after=true`
            ]
          }
        ]
      }
    });
    const Count = 0;
    log.info(`${Count} new call variants found`);
    if (Count > 0) {
      log.debug(JSON.stringify(params));
      const ecs = new AWS.ECS();
      await ecs.runTask(params).promise();
      log.info(`task ${params.taskDefinition} started`);
    } else {
      log.info('no need to run update task, terminating');
    }
  } catch (error) {
    log.error(`error: ${error}`);
  }
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
          subnets: [getEnvVar('SUBNET')],
          securityGroups: [getEnvVar('SECURITY_GROUP')]
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
