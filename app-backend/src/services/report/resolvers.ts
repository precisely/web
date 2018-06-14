/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report, ReportState, ReportAttributes} from './models';
import accessControl from 'src/common/access-control';
import { IContext } from 'accesscontrol-plus';
import { GraphQLContext } from 'src/services/auth/graphql-context';
// import { reactToMarkdownComponents } from 'src/app-client/src/features/markdown/react-to-markdown';
// import { VariantCallAttributes } from 'src/services/variant-call/models';

function reportPublished({resource}: IContext) {
  return resource.get('state') === 'published';
}

function userOwnsResource({user, resource}: IContext) {
  return user.id === resource.get('ownerId');
}

accessControl
  .grant('user')
    .resource('report')
      .read.onFields('*', '!content', '!variants').where(reportPublished)
      .read.onFields('*').where(userOwnsResource)
      .create.where(userOwnsResource)
      .update.where(userOwnsResource);

export interface ReportCreateArgs {
  title: string;
  slug: string;
  content: string;
  variants: string[];
}

export interface ReportUpdateArgs extends ReportCreateArgs {
  id: string;
}

export const resolvers = {
  Query: {
    async reports(_: {}, { state }: { state?: ReportState }, context: GraphQLContext) { // tslint:disable-line
      let query = Report.scan();
      if (state) {
        query.where('state').equals(state);
      }
      const result = await query.execAsync();

      return await context.valid('report:read', result && result.Items);
    },
    async report(_: {}, {slug}: {slug: string}, context: GraphQLContext) {
      const report = await Report.findBySlug(slug);
      return await context.valid('report:read', report);
    }
  },
  Mutation: {
    async createReport(
      _: {}, {title, content, variants}: ReportCreateArgs, context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid('report:create',
        new Report({
          ownerId: context.userId,
          content: content,
          title, variants
        })
      );
      return await Report.saveNew(report);
    },
    async updateReport(
      _: {},
      {id, title, content}: ReportUpdateArgs,
      context: GraphQLContext
    ) {
      const report = <Report> await context.valid(
        'report:update',
        await Report.getAsync(id)
      );
      // process raw content here

      report.set({
        title: title || report.get('title'),
        context: context || report.get('content')
      });
      return await report.updateAsync();
    }
  },
  Report: GraphQLContext.dynamoAttributeResolver<ReportAttributes>('report', {
    id: 'id',
    slug: 'slug',
    title: 'title',
    content: 'content',
    variants: 'variants'
  })
};
