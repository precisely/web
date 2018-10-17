/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// tslint:disable:no-any

import {Handler, Context} from 'aws-lambda';

import {makeLogger} from 'src/common/logger';

import { UserSample, UserSampleAttributes } from './models';

export const createUserSample: Handler = async (
  event: UserSampleAttributes, context: Context
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('createUserSample EVENT: %j\t\tCONTEXT: %j', event, context);
  try {
    const res = await UserSample.createAsync(event, {
      overwrite: false
    });
    return res.get();
  } catch (e) {
    log.error('something is wrong', e);
    // detect AWS SDK DynamoDB error:
    if (e.code === 'ConditionalCheckFailedException') {
      throw new Error(`Attempt to overwrite UserSample(userId=${event.userId}, id=${event.id})`);
    } else {
      throw e;
    }
  }
};

export const updateUserSample: Handler = async (
  event: UserSampleAttributes, context: Context
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('updateUserSample EVENT: %j\t\tCONTEXT: %j', event, context);
  
  const {type, source, ...updateArgs} = event; // disallow changing type and source
  try {
    return await new UserSample(updateArgs).updateAsync({
      expected: {
        userId: event.userId,
        id: event.id
      }
    });
  } catch (e) {
    // detect AWS SDK DynamoDB error:
    if (e.code === 'ConditionalCheckFailedException') {
      throw new Error(`Attempt to update non-existent UserSample(userId=${event.userId}, id=${event.id})`);
    } else {
      throw e;
    }
  }
};
