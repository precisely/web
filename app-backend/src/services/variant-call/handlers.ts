/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {Handler, Context, Callback} from 'aws-lambda';

import {makeLogger} from 'src/common/logger';

import { VariantCallService } from './service';
import { VariantCallAttributes } from './models';

export const batchCreate: Handler = async (event: VariantCallAttributes[], context: Context) => {
  const log = makeLogger(context.awsRequestId);
  log.info('VariantCallBatchCreate EVENT: %j\t\tCONTEXT: %j', event, context);
  return await VariantCallService.addVariantCalls(event);
};
