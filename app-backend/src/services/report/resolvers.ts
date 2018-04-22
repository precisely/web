/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from './models';

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
    async createReport(_: {}, {title, content, genes}: ReportCreateUpdateArgs): Promise<Report> {
      return Report.safeCreate({title, rawContent: content, genes});
    },
    async updateReport(_: {}, {title, content, genes}: ReportCreateUpdateArgs): Promise<Report> {
      return await Report.createAsync({title, rawContent: content, genes});
    }
  }
};
