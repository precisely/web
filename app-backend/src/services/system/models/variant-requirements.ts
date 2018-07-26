/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

// SystemVariantRequirements represents the variant calls that
// need to be pulled from 
import { ExecResult } from 'dynogels';
import * as Joi from 'joi';

import {defineModel, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';
import { JoiStart, JoiRefVersion, JoiRefName, AllowedRefVersion } from 'src/common/variant-constraints';

export class SystemVariantRequirementAttributes {
  refVersion?: string;
  refName?: string;
  start?: number;
  end?: number;
  rsId?: string;
}

export class SystemVariantRequiementMethods {

}

export interface SystemVariantRequirementStaticMethods {

}

// model instance type
export type SystemVariantRequirements = ModelInstance<
  SystemVariantRequirementAttributes, 
  SystemVariantRequiementMethods
>;

export const SystemVariantRequirement = defineModel<
  SystemVariantRequirementAttributes, SystemVariantRequiementMethods, SystemVariantRequirementStaticMethods
  >(
  'system-variant-requirement', {
    hashKey: 'id',

    timestamps : true,

    schema : {
      id: Joi.string(),
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
      
      // rsId
      rsId: Joi.string().optional().regex(/rs\d+/),
      
    },
    indexes: [
      {
        name: 'userGRCh37StartIndex',
        type: 'local',
        hashKey: 'userId',
        rangeKey: 'grch37Start'
      },
      {
        name: 'userRSIdIndex',
        type: 'local',
        hashKey: 'userId',
        rangeKey: 'rsId'
      }
    ]
  }
);

/**
 * Computes / updates dependent attributes
 * @param variantCall
 * @param next
 */
function computeAttributes(variantCall: VariantCallAttributes, next: ListenerNextFunction) {
  const {refName, start, callSetId } = variantCall;
  const rsId = variantCall.rsId || '';
  const end = variantCall.end || '';  
  const refVersion = variantCall.refVersion || AllowedRefVersion;
  const variantId = `${refName}:${refVersion}:${start}:${end}:${rsId}:${callSetId}`;

  if (refVersion !== AllowedRefVersion) {
    next(new Error(`Invalid refVersion: ${refVersion}`));
  } else {
    next(null, {variantId, ...variantCall});
  }
}

VariantCall.before('create', computeAttributes);
VariantCall.before('update', computeAttributes);

//
// STATIC METHOD DEFINITIONS
//
VariantCall.forUser = async function forUser(
  userId: string,
  { refIndexes, rsIds }: VariantCallIndexes
): Promise<VariantCall[]> {
  
  const queries: Promise<ExecResult<any>>[] = []; // tslint:disable-line no-any
  if (refIndexes) {
    refIndexes.forEach((index: RefIndex) => {
      const { refName, refVersion, start} = index;
      if (refName && refVersion && start) {
        const variantIdStart = `${refName}:${refVersion}:${start}`;
        queries.push(VariantCall.query(userId).where('variantId').beginsWith(variantIdStart).execAsync());
      } else {
        throw new Error(`Invalid index for Variant: ${index}`);
      }
    });
  }
  if (rsIds) {
    rsIds.forEach(rsId => {
      queries.push(VariantCall.query(userId).usingIndex('userRSIdIndex').where('rsId').equals(rsId).execAsync());
    });
  }

  const execResults = await Promise.all(queries);
  return <VariantCall[]> (execResults.map( 
    er => (er && er.Count) ? <VariantCall> er.Items[0] : null
  ).filter(x => !!x));
};

//
// INSTANCE METHOD DEFINITIONS
//
// VariantCall.prototype.foo = function foo() {}
