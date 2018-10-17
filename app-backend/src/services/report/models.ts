/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import slugify from 'slugify';

import {ReducibleElement} from 'smart-report';

import dynogels, {defineModel, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';
import {VariantIndex, JoiVariantIndex} from 'src/common/variant-tools';

import {Parser, Analyzer} from './services/smart-report';
import { ReportContentError } from './errors';
import { UserSampleRequirement, JoiUserSampleRequirement } from 'src/services/user-sample/external';

const { uuid } = dynogels.types;

export type ReportState = 'published' | 'draft';

export interface ReportAttributes {
  id?: string;
  slug?: string;
  title?: string;
  ownerId?: string;
  state?: ReportState;
  content?: string;
  publishedContent?: string;
  publishedElements?: ReducibleElement[];
  variantIndexes?: VariantIndex[];
  userSampleRequirements?: UserSampleRequirement[];
  seed?: boolean;
}

// Instance methods
interface ReportMethods { 
  publish(): Promise<Report>;
}

interface ReportStaticMethods {
  findBySlug(slug: string): Promise<Report | null>;
  // safeSave({slug, title, content, variants}: ReportCreateArgs): Promise<Report>;
  safeSave(report: Report): Promise<Report>;
  findUniqueSlug(s: string): Promise<string>;
  listReports({ state, ownerId }: { state?: ReportState, ownerId?: string }): Promise<Report[]>;
}

export interface Report extends ModelInstance<ReportAttributes, ReportMethods> {}

export const Report = defineModel<ReportAttributes, ReportMethods, ReportStaticMethods>('report', {
  hashKey: 'id',

  timestamps : true,

  schema: {
    id: uuid(),
    slug: Joi.string().required(),
    title: Joi.string().required(),
    ownerId: Joi.string().required(),
    state: Joi.string().valid('published', 'draft').default('draft'),
    content: Joi.string().allow(null),
    publishedContent: Joi.string().allow(null),
    publishedElements: Joi.array().items(Joi.object()).allow(null),
    
    // variant calls needed by this report
    variantIndexes: Joi.array().items(JoiVariantIndex).default([]), // variant calls described as refName:start index
    userSampleRequirements: Joi.array().items(JoiUserSampleRequirement).default([]),
    seed: Joi.boolean().description('represents seed data'),
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
Report.findBySlug = async function findBySlug(slug: string): Promise<Report | null> {
  slug = slug.toLowerCase();
  const result = await Report.query(slug).usingIndex('slugIndex').execAsync();
  return (result && result.Count > 0) ? result.Items[0] : null;
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
// 
Report.prototype.publish = async function publishReport() {
  const content = this.getValid('content');
  const {elements, errors} = Parser.parse(content);
  
  if (errors.length > 0) {
    throw new ReportContentError(errors);
  }
  const requirements = Analyzer.extractRequirements(elements);
  this.set({ 
    publishedElements: elements, 
    publishedContent: content, 
    state: 'published', 
    ...requirements });

  return await this.updateAsync();
};

//
// Report Hooks
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

Report.listReports = async function ({ state, ownerId}: { state?: ReportState, ownerId?: string }): Promise<Report[]> {
  let query = Report.scan();

  // TODO: make this more efficient using indexes
  if (state) {
    query.filter('state').equals(state);
  } 
  
  if (ownerId) {
    query.filter('ownerId').equals(ownerId);
  }

  const result = await query.execAsync();

  return result && result.Items;
};

//
// Report Hooks
//
async function setReportSlug(attrs: ReportAttributes, next: ListenerNextFunction) {
  const title = attrs.title;
  if (!title) {
    return next(new Error('Attempt to create report without title'));
  }
  const slugSeed = attrs.slug || title;
  const slug = await Report.findUniqueSlug(slugSeed);
  
  next(null, {...attrs, slug});
}

Report.before('create', setReportSlug);
