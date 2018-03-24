/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query, ExecResult, Item} from 'dynogels-promisified';
import {Report, ReportAttributes} from '../models/Report';
import {GenotypeAttributes} from '../../genotype-service/models/Genotype';
import {AuthorizerAttributes} from '../../interfaces';
import {log} from '../../logger';
import {UserData} from './util/UserData';

export interface CreateOrUpdateAttributes {
  title: string;
  slug: string;
  rawContent: string;
  genes: string[];
}

interface ReportInterface {
  slug?: string;
}

export const reportResolver = {
  async create(args: CreateOrUpdateAttributes, authorizer: AuthorizerAttributes): Promise<ReportAttributes> {
    let reportInstance: Item<ReportAttributes>;
    const {slug, title, genes, rawContent} = args;

    try {
      reportInstance = await Report.createAsync({slug, title, genes, rawContent: rawContent});
    } catch (error) {
      log.error(`reportResolver-create: ${error.message}`);
      return error;
    }

    return reportInstance.get();
  },

  async list(authorizer: AuthorizerAttributes): Promise<ReportAttributes[]> {
    const result: ReportAttributes[] = [];
    let reportList: ExecResult<ReportAttributes>;

    try {
      let query: Query<ReportAttributes>;
      query = Report.query('report');
      reportList = await query.execAsync();
    } catch (error) {
      log.error(`reportResolver-list: ${error.message}`);
      return error;
    }

    reportList.Items.forEach((report: Item<ReportAttributes>) => {
      result.push(report.get());
    });

    return result;
  },

  async get(args: ReportInterface, authorizer: AuthorizerAttributes): Promise<ReportAttributes &
      {userData: () => {genotypes: Promise<GenotypeAttributes[]>}}> {

    const {slug} = args;
    let reportInstance: Item<ReportAttributes>;

    try {
      reportInstance = await Report.getAsync('report', slug);

      if (!reportInstance) {
        throw new Error('No such record found');
      }
    } catch (error) {
      log.error(`reportResolver-get: ${error.message}`);
      return error;
    }

    return {
      ...reportInstance.get(),
      userData: () => {
        const userData = new UserData(
            authorizer.claims.sub,
            reportInstance.get().genes
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
  reports: (root: any) => reportResolver.list(root.authorizer),
  report: (root: any, args: ReportInterface) => reportResolver.get(args, root.authorizer),
};

/* istanbul ignore next */
export const mutations = {
  // TODO: will be fixed with https://github.com/precisely/web/issues/90
  saveReport: (root: any, args: CreateOrUpdateAttributes) => reportResolver.create(args, root.authorizer),
};
