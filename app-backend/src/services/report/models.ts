/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Model, Item, types} from 'src/db/dynamo/dynogels';
import slugify from 'slugify';
const {uuid} = types;

type ReportCreateArgs = {
  title: string,
  slug?: string,
  rawContent: string,
  genes: string[]
};

export interface ReportAttributes {
  id?: string;
  slug?: string;
  title?: string;
  rawContent?: string;
  parsedContent?: string;
  topLevel?: boolean;
  genes?: string[];
}

const StaticMethods = {
  async findBySlug(slug: string): Promise<Report> {
    const result = await Report.query(slug).usingIndex('slugIndex').execAsync();
    return result && result.Items[0];
  },

  async safeCreate({slug, title, rawContent, genes}: ReportCreateArgs): Promise<Report> {
    if (slug && Report.findBySlug(slug)) {
      throw new Error(`Cannot create report with slug "${slug}" - Report already exists`);
    } else {
      slug = await findUniqueSlug(title);
    }

    return await Report.createAsync({slug, title, rawContent, genes});
  }

};

export interface Report extends Item<ReportAttributes>, ReportAttributes {
}

export interface ReportModel extends Model<ReportAttributes> {
  findBySlug?(slug: string): Promise<Report>;
  safeCreate?({slug, title, rawContent, genes}: ReportCreateArgs): Promise<Report>;
}

export const Report: ReportModel = defineModel<ReportAttributes>('report', {
  hashKey: 'id',

  timestamps : true,

  schema: {
    id: uuid(),
    slug: Joi.string().required(),
    title: Joi.string().required(),
    rawContent: Joi.string(),
    parsedContent: Joi.string(),
    topLevel: Joi.boolean(),
    genes: Joi.array().items(Joi.string())
  },

  indexes: [{
    name: 'slugIndex',
    hashKey: 'slug',
    type: 'global'
  }]
}, StaticMethods);

async function findUniqueSlug(s: string): Promise<string> {
  let index = 1;
  let baseSlug = slugify(s);
  let slug = baseSlug;

  while (true) {
    let existingReport = await Report.findBySlug(slug);
    if (!existingReport) {
      return slug;
    }
    slug = `${baseSlug}-${++index}`;
  }
}
