/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from './models';
import accessControl from 'src/common/access-control';
import { Context } from 'rbac-plus';
import { GraphQLContext } from 'src/services/auth/graphql-context';
// import { reactToMarkdownComponents } from 'src/app-client/src/features/markdown/react-to-markdown';
import { VariantCallAttributes } from 'src/services/variant-call/models';

function reportPublished({resource}: Context) {
  return resource.get('state') === 'published';
}

function userOwnsResource({user, resource}: Context) {
  return user.id === resource.get('ownerId');
}

function assignOwnerId({user}: Context) {
  return { ownerId: user.id };
}

accessControl
  .grant('user')
    .resource('Report')
      .action('read').where(reportPublished)
      .action('create').withConstraint(assignOwnerId)
      .action('update').where(userOwnsResource)
        .withConstraint(assignOwnerId);

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
    async createReport(
      _: {}, {title, content, variants}: ReportCreateUpdateArgs, context: GraphQLContext): Promise<Report> {
      const permission = await context.can('report:create');
      return Report.safeCreate({...permission.constraint,
        title, rawContent: content, variants
      });
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
