/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Report, ReportAttributes} from '../models/Report';
import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {UserDataMapAttributes} from '../../user-data-map/models/UserDataMap';
import {genotypeResolver, ListGenotypeFilters, ListGenotypeObject} from '../../genotype-service/api/resolver';
import {AuthorizerAttributes} from '../../interfaces';
import {log} from '../../logger';

export interface CreateOrUpdateAttributes {
  title: string;
  slug: string;
  rawContent: string;
  genes: string[];
}

export interface ListReportFilters {
  limit?: number;
  lastEvaluatedKeys?: {
    id: string;
    slug: string;
  };
  id?: string;
  slug?: string;
  userId?: string;
  vendorDataType?: string;
}

export interface ListReportObject {
  Items: ReportAttributes[];
  LastEvaluatedKey: {
    slug: string;
    id: string;
  };
}

export const reportResolver = {
  async create(args: CreateOrUpdateAttributes, authorizer: AuthorizerAttributes): Promise<ReportAttributes> {
    let reportInstance: {attrs: ReportAttributes};
    const {slug, title, genes, rawContent} = args;

    try {
      reportInstance = await Report.createAsync({slug, title, genes, raw_content: rawContent});
    } catch (error) {
      log.error(`reportResolver-create: ${error.message}`);
      return error;
    }
    
    return reportInstance.attrs;
  },

  async list(args: ListReportFilters, authorizer: AuthorizerAttributes): Promise<ListReportObject> {
    const {lastEvaluatedKeys, slug, limit = 15} = args;
    let result: ListReportObject;
    
    try {
      let query: Query & {execAsync?: () => ListReportObject};

      query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);

      if (lastEvaluatedKeys) {
        query = query.startKey(lastEvaluatedKeys.id, lastEvaluatedKeys.slug);
      }

      result = await query.execAsync();
    } catch (error) {
      log.error(`reportResolver-list: ${error.message}`);
      return error;
    }

    return result;
  },

  async get(args: ListReportFilters, authorizer: AuthorizerAttributes): 
    Promise<ListReportObject & { userData: (genotypeArgs: ListGenotypeFilters) => Promise<ListGenotypeObject>; }> {
      
    const {slug, id, userId, vendorDataType, limit, lastEvaluatedKeys} = args;
    let reportInstance: ListReportObject;
    let userInstance: UserDataMapAttributes;

    try {
      userInstance = await userDataMapResolver.get({user_id: userId, vendor_data_type: vendorDataType});
      let query: Query & {execAsync?: () => ListReportObject};

      if (id) {
        query = Report.query(id).limit(limit);
      } else if (slug) {
        query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);
      } else {
        throw new Error('Required parameters not present.');
      }

      if (lastEvaluatedKeys) {
        query = query.startKey(lastEvaluatedKeys.slug, lastEvaluatedKeys.id);
      }

      reportInstance = await query.execAsync();
    } catch (error) {
      log.error(`reportResolver-get: ${error.message}`);
      return error;
    }
    
    return {
      ...reportInstance,
      userData: (genotypeArgs: ListGenotypeFilters) => genotypeResolver.list(
        {
          opaqueId: userInstance.opaque_id,
          ...genotypeArgs
        }, 
        authorizer
      ),
    };
  },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
  reports: (root: any, args: ListReportFilters) => reportResolver.list(args, root.authorizer),
  report: (root: any, args: ListReportFilters) => reportResolver.get(args, root.authorizer),
};

/* istanbul ignore next */
export const mutations = {
  // TODO: will be fixed with https://github.com/precisely/web/issues/90
  saveReport: (root: any, args: CreateOrUpdateAttributes) => reportResolver.create(args, root.authorizer),
};
