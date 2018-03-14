/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {addEnvironmentToTableName} from '../../utils';
import {dynogels} from '../../dynogels-db/connection';

export interface GenotypeAttributes {
  opaqueId?: string;
  sampleId?: string;
  source?: string;
  gene?: string;
  variantCall?: string;
  zygosity?: string;
  startBase?: string;
  chromosomeName?: string;
  variantType?: string;
  quality?: string;
}

/* istanbul ignore next */
export const Genotype = dynogels.define(addEnvironmentToTableName('precisely-genotype', '01'), {
  hashKey : 'opaqueId',
  rangeKey: 'gene',

  timestamps : true,

  schema : {
    opaqueId: Joi.string(),
    sampleId: Joi.string(),
    source: Joi.string(),
    gene: Joi.string(),
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
    name: 'GenotypeGlobalIndex',
    type: 'global',
  }],
});
