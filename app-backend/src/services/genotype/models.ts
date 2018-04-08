/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Model, Item} from 'src/db/dynamo/dynogels';

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

export interface GenotypeModel extends Model<GenotypeAttributes> {
  forUser?(opaqueId: string, genes: string[]): Promise<Genotype[]>;
}

const StaticMethods = {
  async forUser(opaqueId: string, genes?: string[]): Promise<Genotype[]> {
    let query = await Genotype.query(opaqueId);
    if (genes && genes.length > 0) {
      query = query.where('gene').in(genes);
    }
    const result = await query.execAsync();

    return result && result.Items;
  }
};

// model instance interface
export interface Genotype extends Item<GenotypeAttributes>, GenotypeAttributes {
  // no additional instance methods yet
}

export const Genotype: GenotypeModel = defineModel<GenotypeAttributes>('genotype', {
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
}, StaticMethods);
