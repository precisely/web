/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {log} from 'src/common/logger';
import {Handler, Context, S3CreateEvent, ScheduledEvent, APIGatewayEvent} from 'aws-lambda';
import { SystemVariantRequirement } from 'src/services/system/models/variant-requirement';
import { getEnvVar } from 'src/common/environment';
import { createUserSample } from 'src/services/user-sample/handlers';
import { UserSampleAttributes } from 'src/services/user-sample/models';
import { UserSampleStatus, UserSampleType } from 'src/services/user-sample/external';

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context) => {
  // pass
};

interface LambdaProxyAPIGatewayEvent extends APIGatewayEvent {
  principalId: string;
  paramsQuery: {[key: string]: string};
}

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
}

export async function updateAllUsersVariantCalls(event: ScheduledEvent, context: Context) {
  try {
    let params = makeTaskParams({
      overrides: {
        containerOverrides: [
          {
            name: `${getEnvVar('STAGE')}-BioinformaticsECSContainer`,
            cpu: 512,
            memory: 2048,
            command: [
              '/bin/bash',
              '-c',
              // tslint:disable:max-line-length
              `/precisely/app/run-remote-access.sh && /precisely/app/run-update.sh --data-source=23andme --stage=${getEnvVar('STAGE')} --test-mock-lambda=false --cleanup-after=true`
            ]
          }
        ]
      }
    });
    log.info('checking if any new system variant calls have been added...');
    const res = await SystemVariantRequirement
      .query('new')
      .usingIndex('statusIndex')
      .select('COUNT')
      .execAsync();
    log.info(`res: ${JSON.stringify(res)}`);
    const count = res.Count;
    log.info(`${count} new variant calls found`);
    if (count > 0) {
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
}

export async function getUploadSignedURL(event: LambdaProxyAPIGatewayEvent, context: Context) {
  try {
    log.info('generating signed S3 upload URL');
    log.info('context');
    log.info(JSON.stringify(context));
    log.info('event');
    log.info(JSON.stringify(event));
    if ('public' === event.principalId) {
      throw new Error('authentication failed');
    }
    const principalId = event.principalId.replace(/\|/g, '-'); // pipes are shell-hostile
    // TODO: Stop hardcoding 23andMe as a source.
    const source = '23andme';
    const params = {
      Bucket: getEnvVar('S3_BUCKET_BIOINFORMATICS_UPLOAD'),
      Key: `${principalId}/${source}/${event.paramsQuery.key}`,
      Expires: 600
    };
    // XXX: Signature version 4 is critical! Without it, uploads will fail with
    // mysterious signature and CORS errors.
    const s3 = new AWS.S3({signatureVersion: 'v4'});
    const signedUrl = s3.getSignedUrl('putObject', params);
    return signedUrl;
  } catch (error) {
    log.error(`error: ${error}`);
    return error.toString();
  }
}

async function createUserSampleWrapper(userId: string, source: string, file: string, context: Context) {
  const s: UserSampleAttributes = {
    userId,
    id: file,
    type: UserSampleType.genetics,
    source,
    status: UserSampleStatus.processing,
    statusMessage: 'upload succeeded'
  };
  // tslint:disable-line:no-any
  return await createUserSample(s, context, <any> undefined); // tslint:disable-line no-any
}

export async function processUpload(event: S3CreateEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;
  log.info('starting user upload data import');
  try {
    const stage = getEnvVar('STAGE');
    const inputBucket = event.Records[0].s3.bucket.name;
    const inputFile = decodeURI(event.Records[0].s3.object.key);
    const [userId, source, file] = inputFile.split('/');
    if (!userId || !source || !file) {
      throw new Error(`uploaded file has unexpected path structure: inputBucket=${inputBucket}, inputFile=${inputFile}`);
    }
    log.info(`{"userId": "${userId}", "source": "${source}", "file": "${file}"}`);
    await createUserSampleWrapper(userId, source, file, context);
    log.info('user sample should have been created in DynamoDB');
    let params = makeTaskParams({
      overrides: {
        containerOverrides: [
          {
            name: `${stage}-BioinformaticsECSContainer`,
            command: [
              '/bin/bash',
              '-c',
              // tslint:disable:max-line-length
              `/precisely/app/run-remote-access.sh && /precisely/app/run-user-import.sh --data-source=${source} --upload-path=${inputFile} --user-id='${userId}' --stage=${stage} --test-mock-vcf=false --test-mock-lambda=false --cleanup-after=true`
            ]
          }
        ]
      }
    });
    log.info(`bioinformatics file upload processor triggered for ${inputFile}`);
    const ecs = new AWS.ECS();
    await ecs.runTask(params).promise();
    log.info(`task ${params.taskDefinition} started`);
  } catch (error) {
    log.error(`error: ${error}`);
  }
}
