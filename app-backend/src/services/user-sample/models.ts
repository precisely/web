/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// SystemVariantRequirements represents the variant calls that
// need to be pulled from 
import * as Joi from 'joi';

import {defineModel, ModelInstance } from 'src/db/dynamo/dynogels';
import { UserSampleStatus, UserSampleType } from './external';
import { UserSampleRequirement, UserSampleRequirementStatus } from 'src/services/user-sample/external';

export interface UserSampleAttributes {
  userId?: string;
  id?: string;                      // typically a GUID or filehash
  type?: UserSampleType;
  source?: string;
  status?: UserSampleStatus;
  statusMessage?: string;
  seed?: boolean;
}

export interface UserSampleMethods {
  matchesRequirement(req: UserSampleRequirement): boolean;
}

export class UserSampleStaticMethods {
  async resolveRequirements(userId: string, requirements: UserSampleRequirement[]): Promise<[
    UserSampleRequirementStatus[], 
    UserSampleRequirement[]
  ]> {
    const {Items: samples} = await UserSample.query(userId).execAsync();
    const satisfied: UserSampleRequirementStatus[] = [];
    const unsatisfied: UserSampleRequirement[] = [];
    for (const req of requirements) {
      const matchingSampleIndex = samples.findIndex(s => s.matchesRequirement(req));
      if (matchingSampleIndex === -1) {
        unsatisfied.push(req);
      } else {
        const attrs = samples[matchingSampleIndex].get();
        if (attrs.status !== undefined) {
          satisfied.push(<any> attrs); // tslint:disable-line no-any
        } else {
          throw new Error(`UserSample status is undefined ${attrs}`);
        }
      }
    }
    return [satisfied, unsatisfied];
  }
}

// model instance type
export type UserSample = ModelInstance<
UserSampleAttributes, 
UserSampleMethods
>;

export const UserSample = defineModel<
UserSampleAttributes, UserSampleMethods, UserSampleStaticMethods
  >(
  'user-sample', {
    hashKey: 'userId',
    rangeKey: 'id',

    timestamps : true,

    schema : {
      userId: Joi.string().required(),
      id: Joi.string().required(),

      type: Joi.string().allow(Object.keys(UserSampleType)),
      source: Joi.string().lowercase().required(),
  
      status: Joi.string()
              .allow(Object.keys(UserSampleStatus))
              .default(UserSampleStatus.processing),
      
      statusMessage: Joi.string().allow(null),

      seed: Joi.boolean().allow(null)
    },
  },
  UserSampleStaticMethods
);

//
// Instance methods
//
UserSample.prototype.matchesRequirement = function (req: UserSampleRequirement)  {
  const _this: UserSample = <any> this; // tslint:disable-line no-any
  const {type, source} = _this.get();
  return (
    req.type === type && 
    (!req.source || req.source === source)
  );
};
