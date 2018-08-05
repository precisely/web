/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import { isNumber } from 'util';

import * as Joi from 'joi';
import slugify from 'slugify';

import {Variant as SVNVariant} from 'seqvarnomjs';
import {Context, Reducer, ReducibleElement} from 'smart-report';

import {defineModel, types, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';
import {JoiRSId, JoiRefIndex, normalizeReferenceName} from 'src/common/variant-constraints';
import {RefIndex, VariantCallIndexes} from 'src/services/variant-call/types';

import {PreciselyParser} from './parser';
import {variant} from './services/personalizer/reducers/functions';
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
  variantCallIndexes?: VariantCallIndexes;
}

// Instance methods
class ReportMethods { }

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
    content: Joi.string(),
    parsedContent: Joi.array().items(Joi.object()).allow(null),

    // variant calls needed by this report
    variantCallIndexes: Joi.object({
      refIndexes: Joi.array().items(JoiRefIndex).default([]), // variant calls described as refName:start index
      rsIds: Joi.array().items(JoiRSId).default([]) // or using rsIds
    })
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
// Add them like so:
// Report.prototype.foo = function foo() {}

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
// INSTANCE METHODS
// Add them like so:
// Report.prototype.foo = function foo() {}
/**
 * For manually forcing a requirements update.
 */
Report.prototype.updateRequirements = async function updateReportRequirements() {
  const parsedContent: ReducibleElement[] = JSON.parse(this.getValid('parsedContent'));
  const {variantCallIndexes} = calculateReportRequirements(parsedContent);
  this.set({variantCallIndexes});
  this.saveAsync();
  return this;
};

/**
 * Runs the reducer in analysisMode to discover variants mentioned in the report
 * 
 * @param parsedContent 
 */
export function calculateReportRequirements(parsedContent: ReducibleElement[]
): { variantCallIndexes: VariantCallIndexes } {
  const context: Context = {};
  const reducer = new Reducer({ 
    functions: { variant },   // every mention of variant will be evaluated
    analysisMode: true        // turn on analysisMode
  }); 
  reducer.reduce(parsedContent, context);
  // grab variants and rsIds from the context:
  const variantPatterns = context.__reportSVNVariantPatterns || {};
  const rsIds = Object.keys(context.__reportRSIds || {});
  // convert the SVNVariants to RefIndex, which will be used to query for VariantCalls for each user:
  const resultRefIndexes: RefIndex[] = [];
  // add unique refIndexes
  for (const svnVariantName in variantPatterns) {
    if (variantPatterns.hasOwnProperty(svnVariantName)) {
      const svnVariant = variantPatterns[svnVariantName];
      for (const refIndex of svnVariantToRefIndexes(<SVNVariant> svnVariant)) {
        if (resultRefIndexes.findIndex(rri => refIndexEquals(rri, refIndex)) === -1) {
          resultRefIndexes.push(refIndex);
        }
      }
    }
  }
    
  const result = { variantCallIndexes: { refIndexes: resultRefIndexes, rsIds }};
  return result;
}

function refIndexEquals(ri1: RefIndex, ri2: RefIndex): boolean {
  return (
    ri1.refName === ri2.refName && 
    ri1.start === ri2.start &&
    ri1.refVersion === ri2.refVersion
  );
}

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

async function parseReportContent(attrs: ReportAttributes, next: ListenerNextFunction) {
  const rawContent = attrs.content;
  if (!rawContent) {
    return next(new Error('Report contains no content'));
  }
  let parsedContent: ReducibleElement[] | null = null;
  try {
    parsedContent = PreciselyParser.parse(rawContent);
  } catch (e) {
    return next(e);
  }
  const requirements = calculateReportRequirements(parsedContent);
  next(null, {
    ...attrs, 
    parsedContent: JSON.stringify(parsedContent),
    ...requirements
  });
}

function positionsFromSVNVariant(svnVariant: SVNVariant): number[] {
  return svnVariant.listSimpleVariants().map(sv => {
    if (isNumber(sv.pos)) {
      return sv.pos;
    } else {
      throw new Error(`Unable to process variant: ${sv.toString()}`);
    }
  });
}

function svnVariantToRefIndexes(svnVariant: SVNVariant): RefIndex[] {
  const [refName, refVersion] = normalizeReferenceName(svnVariant.ac);
  const positions = positionsFromSVNVariant(svnVariant);
  return positions.map(pos => ({ refName, refVersion, start: pos }));
}

Report.before('create', setReportSlug);
Report.before('create', parseReportContent);
Report.before('update', parseReportContent);
