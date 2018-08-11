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

export const addNewVariantRequirementsFromReports: Handler = async (
  event: any, context: Context
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.addNewRequirementFromReport EVENT: %j\t\tCONTEXT: %j', event, context);

  return await SystemService.addNewVariantRequirementsFromReports(log);
};

export const updateVariantRequirementStatuses: Handler = async (
  event: SystemVariantRequirementAttributes[], context: Context
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.updateVariantRequirementStatuses EVENT: %j\t\tCONTEXT: %j', event, context);
  if (!isArray(event)) {
    throw new Error(
      `Lambda method updateVariantRequirementStatuses must be invoked with array, but received ${event}`
    );
  } else {
    return await SystemService.updateVariantRequirementStatuses(event, log);
  }
};

export const getVariantRequirements: Handler = async (
  event: SystemVariantRequirementStatus, context: Context
) => {
  const log = makeLogger(context.awsRequestId);
  log.info('system.getVariantRequirements EVENT: %j\t\tCONTEXT: %j', event, context);
  return await SystemService.getVariantRequirements(event, log);
};
