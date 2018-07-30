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
import { isNumber } from 'util';

import {defineModel, ListenerNextFunction, ModelInstance } from 'src/db/dynamo/dynogels';
import { JoiStart, JoiRefVersion, JoiRefName, AllowedRefVersion } from 'src/common/variant-constraints';

export class SystemVariantRequirementAttributes {
  id?: string;
  refVersion?: string;
  refName?: string;
  start?: number;
  status?: 'new' | 'pending' | 'ready';
  end?: number;
}

export class SystemVariantRequirementMethods {

}

interface VariantIndexValues {
  refName?: string;
  start?: number;
  end?: number;
  refVersion?: string;
}
export class SystemVariantRequirementStaticMethods {
  normalizeAttributes(attrs: VariantIndexValues): VariantIndexValues {
    const {refName, start, end, refVersion } = attrs;
    const normalizedRefVersion = refVersion || AllowedRefVersion;
    
    if (!refName || !isNumber(start)) {
      throw new Error(`Invalid start index ${start}`);
    }

    const normalizedEnd = end ? end : start + 1;
    return {...attrs, end: normalizedEnd, refVersion: normalizedRefVersion };
  }

  makeIndex(attrs: VariantIndexValues): string {
    const {refName, refVersion, start, end } = this.normalizeAttributes(attrs);
    return `refIndex:${refName}:${refVersion}:${start}:${end}`;
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
    rangeKey: 'status',

    timestamps : true,

    schema : {
      id: Joi.string(),

      status: Joi.string().allow(['new', 'pending', 'ready']).default('new'),

      //
      // Core VCF data
      //
      // sequence name e.g., chr1...chr22, chrX, chrY, MT
      refName: JoiRefName,
      // the genome version - only GRCh37 for now
      refVersion: JoiRefVersion,
      // start index with respect to sequence - must be string for DynamoDB indexing
      start: JoiStart,
      // end index of variant
      end: Joi.number().greater(Joi.ref('start')),
    }
  },
  SystemVariantRequirementStaticMethods
);

/**
 * Computes / updates dependent attributes
 */
function computeAttributes(attrs: SystemVariantRequirementAttributes, next: ListenerNextFunction) {
  try {
    const normalizedAttrs = SystemVariantRequirement.normalizeAttributes(attrs);
    const index = SystemVariantRequirement.makeIndex(attrs);
    next(null, {...normalizedAttrs, id: index });
  } catch (e) {
    next(e);
  }
}

SystemVariantRequirement.before('create', computeAttributes);
SystemVariantRequirement.before('update', computeAttributes);
