/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from './dynamo-models';

export interface ReportCreateUpdateArgs {
  title: string;
  slug: string;
  content: string;
  genes: string[];
}

export const resolvers = {
  Query: {
    reports() {
      return Report.scan().execAsync();
    },
    report(_: {}, {slug}: {slug: string}): Promise<Report> {
      return Report.findBySlug(slug);
    }
  },
  Mutation: {
    createReport(_: {}, {title, content, genes}: ReportCreateUpdateArgs, ) {
      return Report.safeCreate({title, rawContent: content, genes});
    },
    updateReport(_: {}, {title, content, genes}: ReportCreateUpdateArgs) {

    }
  }

}
export const queries = {
};

/* istanbul ignore next */
export const mutations = {
  // TODO: will be fixed with https://github.com/precisely/web/issues/90
  saveReport: (root: any, args: CreateOrUpdateAttributes) => reportResolver.create(args, root.authorizer),
};
