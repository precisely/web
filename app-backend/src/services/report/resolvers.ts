/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { IResolvers } from 'graphql-tools';
import {ReducedElement} from 'smart-report';

import { IContext } from 'accesscontrol-plus';

import accessControl from 'src/common/access-control';
import { GraphQLContext } from 'src/services/graphql';

import {Report, ReportState, ReportAttributes} from './models';
import {Personalizer} from './services/personalizer';

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

export const resolvers: IResolvers = {
  Query: {
    async reports(_: Report, { state }: { state?: ReportState }, context: GraphQLContext) {
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
      _: Report, {title, content, variants}: ReportCreateArgs, context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid('report:create',
        new Report({
          ownerId: context.userId,
          content: content,
          title, variants
        })
      );
      return await report.updateAsync();
    },
    async updateReport(
      _: Report,
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
        content: content || report.get('content')
      });
      return await report.updateAsync();
    }
  },

  Report: {
    ...GraphQLContext.dynamoAttributeResolver<ReportAttributes>('report', {
      id: 'id',
      ownerId: 'ownerId',
      slug: 'slug',
      title: 'title',
      content: 'content',
      requiredVariants: 'variants'
    }), ...{
      personalization(
        report: Report, { userId }: { userId: string }, context: GraphQLContext
      ): Promise<ReducedElement[]> {
        if (!userId) {
          userId = context.userId;
        }
        const personalizer = new Personalizer(report, userId);
        return personalizer.personalize();
      }
    }
  }
};
