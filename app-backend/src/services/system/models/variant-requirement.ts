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

import {defineModel, ListenerNextFunction, ModelInstance } from 'src/db/dynamo/dynogels';
import { JoiStart, JoiRefVersion, JoiRefName, VariantIndex } from 'src/common/variant-tools';
import { ensureProps } from 'src/common/type-tools';

export enum SystemVariantRequirementStatus {
  new = 'new',
  pending = 'pending',
  ready = 'ready',
  error = 'error'
}

export class SystemVariantRequirementAttributes {
  id?: string;
  accession?: string;
  refVersion?: string;
  refName?: string;
  start?: number;
  status?: keyof typeof SystemVariantRequirementStatus;
  errorLog?: string;
}

export class SystemVariantRequirementMethods {

}

export class SystemVariantRequirementStaticMethods {
  makeId(attrs: Partial<VariantIndex>): string {
    const {refName, refVersion, start} = ensureProps(attrs, 'refName', 'refVersion', 'start');
    return `refIndex:${refName}:${refVersion}:${start}`;
  }
}

// model instance type
export type SystemVariantRequirement = ModelInstance<
  SystemVariantRequirementAttributes, 
  SystemVariantRequirementMethods
>;

export const SystemVariantRequirement = defineModel<
  SystemVariantRequirementAttributes, SystemVariantRequirementMethods, SystemVariantRequirementStaticMethods
  >(
  'system-variant-requirement', {
    hashKey: 'id',

    timestamps : true,

    schema : {
      static: Joi.string().allow('current').default('current'),

      id: Joi.string(),

      status: Joi.string()
              .allow(Object.keys(SystemVariantRequirementStatus))
              .default(SystemVariantRequirementStatus.new),

      //
      // Core VCF data
      //
      // sequence name e.g., chr1...chr22, chrX, chrY, MT
      refName: JoiRefName.required(),
      // the genome version - only GRCh37 for now
      refVersion: JoiRefVersion.required(),
      // start index with respect to sequence - must be string for DynamoDB indexing
      start: JoiStart.required(),
    },

    indexes: [
      { 
        name: 'statusIndex',
        type: 'global',
        hashKey: 'status',
        rangeKey: 'id'
      }
    ]
  },
  SystemVariantRequirementStaticMethods
);

/**
 * Computes / updates dependent attributes
 */
function computeAttributes(attrs: SystemVariantRequirementAttributes, next: ListenerNextFunction) {
  try {
    const {refName, refVersion, start } = ensureProps(attrs, 'refName', 'refVersion', 'start');
    const index = SystemVariantRequirement.makeId({refName, refVersion, start});
    // debugger;
    // const accession = refToNCBIAccession(refName, refVersion);
    next(null, {...attrs, id: index });
  } catch (e) {
    next(e);
  }
}

function checkAttributes(attrs: SystemVariantRequirementAttributes, next: ListenerNextFunction) {
  try {
    if (attrs.refName || attrs.start || attrs.refVersion) {
      const expectedId = SystemVariantRequirement.makeId(<VariantIndex> attrs);
      if (attrs.id !== expectedId) {
        next(new Error('Attempt to update index attributes of a SystemVariantRequirement'));
      } else {
        next(null, {...attrs});
      }
    } else {
      next(null, attrs);
    }
  } catch (e) {
    next(e);
  }
}

SystemVariantRequirement.before('create', computeAttributes);
SystemVariantRequirement.before('update', checkAttributes);
