/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Item, types} from 'src/db/dynamo/dynogels';
import slugify from 'slugify';
const {uuid} = types;

export interface ReportAttributes {
  id?: string;
  slug?: string;
  title?: string;
  ownerId?: string;
  rawContent?: string;
  parsedContent?: string;
  topLevel?: boolean;
  variants?: string[];
}

// Instance methods
class ReportMethods {
}

type ReportCreateArgs = {
  title: string,
  slug?: string,
  rawContent: string,
  variants: string[]
};

interface ReportStaticMethods {
  findBySlug(slug: string): Promise<Report>;
  safeCreate({slug, title, rawContent, variants}: ReportCreateArgs): Promise<Report>;
  findUniqueSlug(s: string): Promise<string>;
}

export interface Report extends Item<ReportAttributes, ReportMethods> {}

export const Report = defineModel<ReportAttributes, ReportMethods, ReportStaticMethods>('report', {
  hashKey: 'id',

  timestamps : true,

  schema: {
    id: uuid(),
    slug: Joi.string().required(),
    title: Joi.string().required(),
    ownerId: Joi.string().required(),
    rawContent: Joi.string(),
    parsedContent: Joi.string(),
    topLevel: Joi.boolean(),
    variants: Joi.array().items(Joi.string())
  },

  indexes: [{
    name: 'slugIndex',
    hashKey: 'slug',
    type: 'global'
  }]
});

//
// STATIC METHODS
//
Report.findBySlug = async function findBySlug(slug: string): Promise<Report> {
  const result = await Report.query(slug).usingIndex('slugIndex').execAsync();
  return result && result.Items[0];
};

Report.safeCreate = async function safeCreate({slug, title, rawContent, variants}: ReportCreateArgs): Promise<Report> {
  if (slug && Report.findBySlug(slug)) {
    throw new Error(`Cannot create report with slug "${slug}" - Report already exists`);
  } else {
    slug = await Report.findUniqueSlug(title);
  }

  return await Report.createAsync({slug, title, rawContent, variants});
};

Report.findUniqueSlug = async function findUniqueSlug(s: string): Promise<string> {
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
};

//
// INSTANCE METHODS
//
// Report.prototype.foo = function foo() {}
