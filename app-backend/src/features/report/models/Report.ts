/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {Model} from 'dynogels-promisified';
import {GenotypeAttributes} from '../../../features/genotype/models/Genotype';
import {addEnvironmentToTableName} from '../../../utils';
import {dynogels} from '../../../data-source/dynogels-db/connection';

export interface ReportAttributes {
  type?: 'generic-report';
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
  hashKey: 'type',
  rangeKey: 'slug',

  timestamps : true,

  schema: {
    type: Joi.string().default('generic-report'), // Added to make list work without args
    id: dynogels.types.uuid(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    rawContent: Joi.string(),
    parsedContent: Joi.string(),
    topLevel: Joi.boolean(),
    genes: Joi.array().items(Joi.string()),
  }
});
