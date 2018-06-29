/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Item, types, ListenerNextFunction} from 'src/db/dynamo/dynogels';
import slugify from 'slugify';
import {PreciselyParser} from './parser';

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
  // safeSave({slug, title, content, variants}: ReportCreateArgs): Promise<Report>;
  safeSave(report: Report): Promise<Report>;
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
    parsedContent: Joi.array().items(Joi.object()).allow(null),
    variants: Joi.array().items(Joi.string()).allow(null)
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

Report.findUniqueSlug = async function findUniqueSlug(s: string): Promise<string> {
  let index = 1;
  let baseSlug = slugify(s).toLowerCase();
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
// Add them like so:
// Report.prototype.foo = function foo() {}

//
// Report Hooks
//
async function setReportSlug(attrs: ReportAttributes, next: ListenerNextFunction) {
  const title = attrs.title;
  if (!title) {
    return next(new Error('Attempt to create report without title'));
  }
  const slugSeed = attrs.slug || attrs.title;
  const slug = await Report.findUniqueSlug(slugSeed);
  next(null, {...attrs, slug});
}

async function parseReportContent(attrs: ReportAttributes, next: ListenerNextFunction) {
  const rawContent = attrs.content;
  try {
    const parsedContent = PreciselyParser.parse(rawContent);
    next(null, {...attrs, parsedContent: JSON.stringify(parsedContent)});
  } catch (e) {
    next(e);
  }
}

Report.before('create', setReportSlug);
Report.before('create', parseReportContent);
Report.before('update', parseReportContent);
