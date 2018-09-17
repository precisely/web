/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:49:49 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-09-16 14:26:10
 */

// SystemVariantRequirements represents the variant calls that
// need to be pulled from 
import * as Joi from 'joi';
import {v4} from 'uuid';

import {defineModel, ModelInstance } from 'src/db/dynamo/dynogels';

export enum UserSampleStatus {
  ready = 'ready',
  processing = 'processing',
  error = 'error'
}

export class UserSampleAttributes {
  userId?: string;
  id?: string;                // typically a GUID or filehash
  type?: 'genetics' | 'survey';     // genetics | 
  source?: string;
  status?: UserSampleStatus;
  statusMessage?: string;
}

export class UserSampleMethods {

}

export class UserSampleStaticMethods {
}

// model instance type
export type UserSample = ModelInstance<
UserSampleAttributes, 
UserSampleMethods
>;

export enum UserSampleSource {
  genetics = 'genetics',
  survey = 'survey'
}

export const UserSample = defineModel<
UserSampleAttributes, UserSampleMethods, UserSampleStaticMethods
  >(
  'user-sample', {
    hashKey: 'userId',
    rangeKey: 'id',

    timestamps : true,

    schema : {
      userId: Joi.string().required(),
      id: Joi.string().required().default(v4, 'uuid-v4'),

      type: Joi.string().allow(Object.keys(UserSampleSource)),
      source: Joi.string().required(),
  
      status: Joi.string()
              .allow(Object.keys(UserSampleStatus))
              .default(UserSampleStatus.processing),
      
      statusMessage: Joi.string().allow(null)
    },
  },
  UserSampleStaticMethods
);
