/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {ReportAttributes} from '../../../features/report/models/Report';
import {GenotypeAttributes} from '../../../features/genotype/models/Genotype';
import {Authorizer} from '../../../interfaces';
import {UserData} from '../../../features/user-data/utils/UserData';
import {CreateArgs} from '../interfaces';
import * as ReportService from '../../../features/report/services/Report';

export const reportResolver = {
  async create(args: CreateArgs, authorizer: Authorizer): Promise<ReportAttributes> {
    let reportInstance = ReportService.create(args);
    return reportInstance;
  },

  async list(authorizer: Authorizer): Promise<ReportAttributes[]> {
    const reportList = ReportService.list();
    return reportList;
  },

  async get(args: {slug: string}, authorizer: Authorizer): Promise<ReportAttributes &
      {userData: () => {genotypes: Promise<GenotypeAttributes[]>}}> {

    let reportInstance = await ReportService.get(args.slug);

    return {
      ...reportInstance,
      userData: function() {
        const userData = new UserData(
            authorizer.claims.sub,
            reportInstance.genes
          );

        return {
          genotypes: userData.getGenotypes(),
        };
      }
    };
  },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
  reports: (root: any) => reportResolver.list(root.authorizer),
  report: (root: any, args: {slug: string}) => reportResolver.get(args, root.authorizer),
};

/* istanbul ignore next */
export const mutations = {
  // TODO: will be fixed with https://github.com/precisely/web/issues/90
  saveReport: (root: any, args: CreateArgs) => reportResolver.create(args, root.authorizer),
};
