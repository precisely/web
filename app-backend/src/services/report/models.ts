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

export type ReportState = 'published' | 'draft';

export interface ReportAttributes {
  id?: string;
  slug?: string;
  title?: string;
  ownerId?: string;
  state?: ReportState;
  content?: string;
  parsedContent?: string;
  variants?: string[];
}

// Instance methods
class ReportMethods {
}

// type ReportCreateArgs = {
//   ownerId: string,
//   title: string,
//   slug?: string,
//   content: string,
//   variants: string[]
// };

interface ReportStaticMethods {
  findBySlug(slug: string): Promise<Report>;
  // safeCreate({slug, title, content, variants}: ReportCreateArgs): Promise<Report>;
  saveNew(report: Report): Promise<Report>;
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
    state: Joi.string().valid('published', 'draft').default('draft'),
    content: Joi.string(),
    parsedContent: Joi.string(),
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

Report.saveNew = async function saveNew(report: Report): Promise<Report> {
  let slug = report.get('slug');
  if (slug && Report.findBySlug(slug)) {
    throw new Error(`Cannot create report with slug "${slug}" - Report already exists`);
  } else {
    slug = await Report.findUniqueSlug(report.get('title'));
    report.set({ slug });
  }
  return report.saveAsync();
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
