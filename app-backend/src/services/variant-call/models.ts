/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import { ExecResult } from 'dynogels';
import * as Joi from 'joi';

import {defineModel, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';
import { JoiStart, JoiRefVersion, JoiRefName, AllowedRefVersion } from 'src/common/variant-constraints';

import {RefIndex, VariantCallIndexes} from './types';

export class VariantCallAttributes {
  userId?: string;
  variantId?: string; // unique value determined from other parameters
                      // see computeAttributes

  refVersion?: string;
  // this is equivalent to GA4GH callset Id - this is the id of a dataset
  // uploaded by the user, produced by Akesogen, etc.
  callSetId?: string;
  // sequence name e.g., chr1
  refName?: string;
  // start index with respect to sequence - must be string for DynamoDB indexing
  start?: number;
  // end index of variant
  end?: number;
  // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
  altBases?: string[];
  // sequence being replaced e.g., "A"
  refBases?: string;
  // array of 1-based indexes into alternateBases
  genotype?: number[];
  // Phred scale likelihood corresponding to genotypes 0/0, 0/1, and 1/1
  genotypeLikelihood?: number;
  // Filter
  filter?: string[];

  //
  // Annotations
  //
  rsId?: string;
  gene?: string;
  geneStart?: number;
  geneEnd?: number;
  zygosity?: keyof typeof Zygosity;
}

interface VariantCallMethods {
}

interface VariantCallStaticMethods {
  forUser(
    userId: string,
    variantIndexes: VariantCallIndexes
  ): Promise<VariantCall[]>;
}

// model instance type
export type VariantCall = ModelInstance<VariantCallAttributes, VariantCallMethods>;

export enum Zygosity {
  heterozygous = 'heterozygous',
  homozygous = 'homozygous', 
  wildtype = 'wildtype', 
  haploid = 'haploid'
}

export const VariantFilter = [ 'IMP', 'FAIL', 'BOOST' ];
export const VariantCall = defineModel<
  VariantCallAttributes, VariantCallMethods, VariantCallStaticMethods
  >(
  'variant-call', {
    hashKey : 'userId',
    rangeKey: 'variantId',

    timestamps : true,

    schema : {
      userId: Joi.string(),

      variantId: Joi.string().required(),

      //
      // Core VCF data
      //
      // sequence name e.g., chr1...chr22, chrX, chrY, MT
      refName: JoiRefName,
      // the genome version - only GRCh37 for now
      refVersion: JoiRefVersion,
      // this is equivalent to GA4GH callset Id
      callSetId: Joi.string().required().regex(/\w+/, 'callSetId pattern'),
      // start index with respect to sequence - must be string for DynamoDB indexing
      start: JoiStart,
      // end index of variant
      end: Joi.number().greater(Joi.ref('start')),
      // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
      altBases: Joi.array().items(Joi.string().uppercase().regex(/([ATGC]+)|<NON_REF>/, 'altbases pattern')).min(1),
      // sequence being replaced e.g., "A"
      refBases: Joi.string().uppercase().regex(/[ATGC]+/, 'reference bases pattern'),
      // array of 1-based indexes into alternateBases
      genotype: Joi.array().items(Joi.number()),
      // Phred scale likelihood corresponding to genotypes 0/0, 0/1, and 1/1
      genotypeLikelihood: Joi.array().items(Joi.number()).length(3).optional(),
      // Filter
      filter: Joi.array().items(Joi.string().uppercase().valid(...VariantFilter)).optional(),

      //
      // Annotations
      //
      rsId: Joi.string().optional().regex(/rs\d+/),
      gene: Joi.string().optional(),
      geneStart: Joi.number().optional(), // genomic coordinate for start base
      geneEnd: Joi.number().optional(),   // genomic coordinate for end base
      zygosity: Joi.string().valid(...Object.values(Zygosity)).optional(), // heterozygous, homozygou,

      //
      // Index support
      //
      grch37Start: Joi.string().regex(/[\w\d]+:.*/) // chr{n}:{1-based-genomic-index}
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
  const {refName, start, callSetId, genotype } = variantCall;
  const rsId = variantCall.rsId || '';
  const end = variantCall.end || '';  
  const refVersion = variantCall.refVersion || AllowedRefVersion;
  const variantId = `${refName}:${refVersion}:${start}:${end}:${rsId}:${callSetId}`;
  if (!genotype) {
    throw new Error(`Invalid VariantCall parameters - no genotype`);
  }
  const zygosity = zygosityFromGenotype(genotype);

  if (refVersion !== AllowedRefVersion) {
    next(new Error(`Invalid refVersion: ${refVersion}`));
  } else {
    next(null, {...variantCall, variantId, zygosity});
  }
}

function zygosityFromGenotype(genotype?: number[]): Zygosity | undefined {
  if (!genotype) {
    return;
  }

  genotype.sort();

  if (genotype === [0, 0]) {
    return Zygosity.wildtype;
  } else if (genotype.length === 1) {
    return Zygosity.haploid;
  } else if (genotype.every(g => g === genotype[0])) {
    return Zygosity.homozygous;
  } else {
    return Zygosity.heterozygous;
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
