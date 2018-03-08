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
  raw_content: string;
  parsed_content: string;
  top_level: boolean;
  genes: string[];
  genotype: GenotypeAttributes[];
}

/* istanbul ignore next */
export const Report = dynogels.define(addEnvironmentToTableName('precisely-report', '01'), {
  hashKey: 'id',
  rangeKey: 'slug',

  timestamps : true,

  schema: {
    id: dynogels.types.uuid(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    raw_content: Joi.string(),
    parsed_content: Joi.string(),
    top_level: Joi.boolean(),
    genes: Joi.array().items(Joi.string()),
  },

  indexes: [{
    hashKey: 'slug',
    rangeKey: 'id',
    name: 'ReportGlobalIndex',
    type: 'global',
  }],
});
