/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from './models';
import { scoped } from 'src/services/auth';

export interface ReportCreateUpdateArgs {
  title: string;
  slug: string;
  content: string;
  variants: string[];
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
    async createReport(_: {}, {title, content, variants}: ReportCreateUpdateArgs): Promise<Report> {
      return Report.safeCreate({title, rawContent: content, variants});
    },
    async updateReport(_: {}, {title, content, variants}: ReportCreateUpdateArgs): Promise<Report> {
      return await Report.createAsync({title, rawContent: content, variants});
    }
  },
  Report: {
    id(report: Report) { return report.get('id'); },
    slug(report: Report) { return report.get('slug'); },
    title(report: Report) { return report.get('title'); },
    rawContent(report: Report) { return report.get('rawContent'); },
    owner(report: Report) { return report.get('ownerId'); }
  }
};
