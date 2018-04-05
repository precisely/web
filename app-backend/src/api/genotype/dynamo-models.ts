/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Model, Item} from 'src/storage/dynamo/dynogels';

export interface GenotypeAttributes {
  opaqueId?: string;
  sampleId?: string;
  source?: string;
  gene?: string;
  variantCall?: string;
  zygosity?: string;
  startBase?: string;
  chromosome?: string;
  variantType?: string;
  quality?: string;
}

interface GenotypeModel extends Model<GenotypeAttributes> {
  // no static methods yet
}

// model instance interface
export interface Genotype extends Item<GenotypeAttributes>, GenotypeAttributes {
  // no additional instance methods yet
}

export const Genotype: GenotypeModel = defineModel<GenotypeAttributes>('genotype', 1, {
  hashKey : 'opaqueId',
  rangeKey: 'gene',

  timestamps : true,

  schema : {
    opaqueId: Joi.string(),
    sampleId: Joi.string(),
    source: Joi.string(),
    gene: Joi.string(),
    geneFilter: Joi.string(),
    variantCall: Joi.string(),
    zygosity: Joi.string(),
    startBase: Joi.string(),
    chromosomeName: Joi.string(),
    variantType: Joi.string(),
    quality: Joi.string(),
  },

  indexes: [{
    hashKey: 'gene',
    rangeKey: 'opaqueId',
    name: 'geneIndex',
    type: 'global',
  }],
});
