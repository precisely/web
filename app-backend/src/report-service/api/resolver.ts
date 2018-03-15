/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Report, ReportAttributes} from '../models/Report';
import {GenotypeAttributes} from '../../genotype-service/models/Genotype';
import {AuthorizerAttributes} from '../../interfaces';
import {log} from '../../logger';
import {execAsync} from '../../utils';
import {UserData} from './util/UserData';

export interface CreateOrUpdateAttributes {
  title: string;
  slug: string;
  rawContent: string;
  genes: string[];
}

export interface ListReportFilters {
  limit?: number;
  id?: string;
  slug?: string;
  userId?: string;
  vendorDataType?: string;
}

export interface ListReportObject {
  items: {attrs: ReportAttributes}[];
}

export interface UserDataMapAttributes {
  userId: string;
  vendorDataType: string;
  opaqueId: string;
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

  async list(args: ListReportFilters, authorizer: AuthorizerAttributes): Promise<ReportAttributes[]> {
    const {slug, limit = 15} = args;
    const result: ReportAttributes[] = [];
    let reportList: ListReportObject;
    
    try {
      let query: Query & {execAsync?: () => ListReportObject};

      query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);

      reportList = await execAsync(query);
    } catch (error) {
      log.error(`reportResolver-list: ${error.message}`);
      return error;
    }

    reportList.items.forEach((report: {attrs: ReportAttributes}) => {
      result.push(report.attrs);
    });

    return result;
  },

  async get(args: ListReportFilters, authorizer: AuthorizerAttributes): Promise<ReportAttributes & 
      {userData: (userArgs: {vendorDataType: string}) => {genotypes: Promise<GenotypeAttributes[]>}}> {
      
    const {slug} = args;
    let reportInstance: ListReportObject;

    try {
      let query: Query & {execAsync?: () => ListReportObject};

      query = Report.query(slug).usingIndex('ReportGlobalIndex');
      reportInstance = await execAsync(query);

      if (!reportInstance) {
        throw new Error('No such record found');
      }
    } catch (error) {
      log.error(`reportResolver-get: ${error.message}`);
      return error;
    }
    console.log(reportInstance);
    return {
      ...reportInstance.items[0].attrs, 
      userData: (userArgs: {vendorDataType: string}) => {
        const userData = new UserData(
            authorizer.claims.sub, 
            userArgs.vendorDataType, 
            reportInstance.items[0].attrs.genes
          );
        
        return {
          genotypes: userData.genotypes(),
        };
      }
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
