/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {GenotypeAttributes} from '../../genotype-service/models/Genotype';
import {addEnvironmentToTableName} from '../../utils';
import {dynogels} from '../../dynogels-db/connection';

export interface ReportAttributes {
  id?: string;
  title: string;
  slug: string;
  rawContent: string;
  parsedContent: string;
  topLevel: boolean;
  genes: string[];
  genotype: GenotypeAttributes[];
}

/* istanbul ignore next */
export const Report = dynogels.define(addEnvironmentToTableName('precisely-report', '01'), {
  hashKey: 'id',

  timestamps : true,

  schema: {
    id: dynogels.types.uuid(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    rawContent: Joi.string(),
    parsedContent: Joi.string(),
    topLevel: Joi.boolean(),
    genes: Joi.array().items(Joi.string()),
  },

  indexes: [{
    hashKey: 'slug',
    name: 'ReportGlobalIndex',
    type: 'global',
  }],
});
