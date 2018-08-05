/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// tslint:disable:no-any

import { isArray } from 'util';
import {Handler, Context, Callback} from 'aws-lambda';

import {makeLogger} from 'src/common/logger';

import { SystemService } from './service';
import { SystemVariantRequirementAttributes, SystemVariantRequirementStatus } from './models';

export const addNewVariantRequirementsFromReports: Handler = (
  event: any, context: Context, callback: Callback
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.addNewRequirementFromReport EVENT: %j\t\tCONTEXT: %j', event, context);

  SystemService.addNewVariantRequirementsFromReports()
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

export const updateVariantRequirementStatuses: Handler = (
  event: SystemVariantRequirementAttributes[], context: Context, callback: Callback
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.updateVariantRequirementStatuses EVENT: %j\t\tCONTEXT: %j', event, context);
  if (!isArray(event)) {
    callback(new Error(
      `Lambda method updateVariantRequirementStatuses must be invoked with array, but received ${event}`
    ));
  } else {
    SystemService.updateVariantRequirementStatuses(event)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  }
};

export const getVariantRequirements: Handler = (
  event: SystemVariantRequirementStatus, context: Context, callback: Callback
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.getVariantRequirements EVENT: %j\t\tCONTEXT: %j', event, context);
  SystemService.getVariantRequirements(event)
    .then(result => callback(null, result))
    .catch(error => callback(error));
};
