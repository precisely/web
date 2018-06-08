/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Item} from 'src/db/dynamo/dynogels';

export class VariantCallAttributes {
  userId: string;
  variantId: string; // referenceName:startBaseIndex:callSetId
                     // chr1:123918556:947101386017

  genomeVersion?: string;
  // this is equivalent to GA4GH callset Id - this is the id of a dataset
  // uploaded by the user, produced by Akesogen, etc.
  callSetId?: string;
  // sequence name e.g., chr1
  referenceName?: string;
  // start index with respect to sequence - must be string for DynamoDB indexing
  startBaseIndex?: string;
  // end index of variant
  endBaseIndex?: string;
  // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
  alternateBases?: string[];
  // sequence being replaced e.g., "A"
  referenceBases?: string;
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
  zygosity?: string;
}

interface VariantCallMethods {
  start: number;
  end: number;
}

interface VariantCallStaticMethods {
  forUser(userId: string, genes?: string[]): Promise<VariantCall[]>;
}

// model instance type
export type VariantCall = Item<VariantCallAttributes, VariantCallMethods>;

export const Zygosity = [ 'heterozygous', 'homozygous', 'wildtype', 'haploid' ];
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

      // variantId structure: {referenceName}:{startIndex}:{callSetId}:{genomeVersion}
      variantId: Joi.string().regex(/^\w+:\d+:[^:]+:[^:]+$/),

      //
      // Core VCF data
      //
      // sequence name e.g., chr1
      referenceName: Joi.string(),
      // the genome version
      genomeVersion: Joi.string(),
      // this is equivalent to GA4GH callset Id
      callSetId: Joi.string(),
      // start index with respect to sequence - must be string for DynamoDB indexing
      startBaseIndex: Joi.string(),
      // end index of variant
      endBaseIndex: Joi.string(),
      // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
      alternateBases: Joi.array().items(Joi.string().uppercase().regex(/([ATGC]+)|<NON_REF>/)).min(1),
      // sequence being replaced e.g., "A"
      referenceBases: Joi.string().uppercase().regex(/[ATGC]+/),
      // array of 1-based indexes into alternateBases
      genotype: Joi.array().items(Joi.number()),
      // Phred scale likelihood corresponding to genotypes 0/0, 0/1, and 1/1
      genotypeLikelihood: Joi.array().items(Joi.number()).length(3).optional(),
      // Filter
      filter: Joi.array().items(Joi.string().uppercase().valid(...VariantFilter)).optional(),

      //
      // Annotations
      //
      rsId: Joi.string().optional(),
      gene: Joi.string().optional(),
      geneStart: Joi.number().optional(), // genomic coordinate for start base
      geneEnd: Joi.number().optional(),   // genomic coordinate for end base
      zygosity: Joi.string().valid(...Zygosity).optional(), // heterozygous, homozygou,
    }
  }
);

//
// STATIC METHOD DEFINITIONS
//
VariantCall.forUser = async function forUser(userId: string, start?: string[]): Promise<VariantCall[]> {
  let query = await VariantCall.query(userId);
  if (start && start.length > 0) {
    query = query.where('startBaseIndex').in(start);
  }
  const result = await query.execAsync();

  return result && result.Items;
};

//
// INSTANCE METHOD DEFINITIONS
//
VariantCall.prototype.start = function () {
  return parseInt(this.get('startBaseIndex'), 10);
};

VariantCall.prototype.end = function () {
  return parseInt(this.get('endBaseIndex'), 10);
};
