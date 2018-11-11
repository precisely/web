/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// yes, this is duplicative of what is in common.js, but I am paranoid
export const isOffline = !process.env.STAGE || !/^(no|0|false|)$/i.test(process.env.IS_OFFLINE || '');
export const inServerlessProcess = !!process.env.IN_SERVERLESS_PROCESS;
export const dynamoDBDefaultBatchSize = 
  process.env.DYNAMODB_DEFAULT_BATCH_SIZE ? 
  parseInt(process.env.DYNAMODB_DEFAULT_BATCH_SIZE, 10) : 25;

import {isUndefined} from 'util';

export function getEnvVar(varName: string): string {
  const value = process.env[varName];
  if (isUndefined(value)) {
    throw new Error(`Environment variable ${varName} is undefined`);
  }
  return value;
}
