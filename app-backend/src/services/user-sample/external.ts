/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 */

 // UserSample definitions used externally
import * as Joi from 'joi';

export enum UserSampleStatus {
  ready = 'ready',
  processing = 'processing',
  error = 'error'
}

export enum UserSampleType {
  genetics = 'genetics',
  survey = 'survey'
}

export interface UserSampleRequirement {
  type: UserSampleType;
  source?: string;
}

export interface UserSampleRequirementStatus extends UserSampleRequirement {
  status: UserSampleStatus;
}

export const JoiUserSampleRequirement = Joi.object({
  type: Joi.string().allow(Object.keys(UserSampleType)).required(),
  source: Joi.string().allow(null)
});
