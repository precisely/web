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
import {Model} from 'dynogels-promisified';
import {dynogels} from '../../data-source/dynogels-db/connection';

export interface ReportAttributes {
  hashKey?: 'report';
  id?: string;
  title: string;
  slug: string;
  rawContent?: string;
  parsedContent?: string;
  topLevel?: boolean;
  genes?: string[];
  genotype?: GenotypeAttributes[];
}

/* istanbul ignore next */
export const Report: Model<ReportAttributes> = dynogels.define(addEnvironmentToTableName('precisely-report', '01'), {
  hashKey: 'hashKey',
  rangeKey: 'slug',

  timestamps : true,

  schema: {
    hashKey: Joi.string().default('report'), // Added to make list work without args
    id: dynogels.types.uuid(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    rawContent: Joi.string(),
    parsedContent: Joi.string(),
    topLevel: Joi.boolean(),
    genes: Joi.array().items(Joi.string()),
  }
});
