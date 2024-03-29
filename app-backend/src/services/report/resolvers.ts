/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { IResolvers } from 'graphql-tools';

import { IContext } from 'accesscontrol-plus';

import { GraphQLContext, accessControl } from 'src/services/graphql';

import { Report, ReportState, ReportAttributes } from './models';
import { Personalizer } from './services/smart-report';
import { UserSampleRequirement } from 'src/services/user-sample/external';
import { NotFoundError } from 'src/common/errors';
import { Personalization } from './services/smart-report/personalizer';

function reportPublished({resource}: IContext) {
  return resource.get('state') === 'published';
}

function userOwnsResource({user, resource}: IContext) {
  return user.id === resource.get('ownerId');
}

function userIdArgumentIsUserOrImplicit({args, user}: IContext) {
  return !args.userId || args.userId === user.id;
}

// tslint:disable no-unused-expression
accessControl
  // note: currently, reports can only be accessed by logged in users
  //       this might need to change when we make reports SEO-accessible
  .grant('user')
    .resource('report')
      .read.onFields('*', '!content', '!variantIndexes', '!personalization').where(reportPublished)
      .read.onFields('personalization').where(userIdArgumentIsUserOrImplicit)
  .grant('author')
    .resource('report')
      .read.onFields('*').where(userOwnsResource) 
      .create
      .update.where(userOwnsResource)
      .action('publish').where(userOwnsResource);
// tslint:enable no-unused-expressions

export interface ReportCreateArgs {
  title?: string;
  subtitle?: string;
  content?: string;
  userSampleRequirements?: UserSampleRequirement[];
}

export interface ReportUpdateArgs extends Partial<ReportCreateArgs> {
  id: string;
}

export const resolvers = {
  Query: {
    async reports(
      _: null | undefined, 
      { state, ownerId }: { state?: ReportState, ownerId?: string }, 
      context: GraphQLContext
    ) {
      ownerId = ownerId || context.userId;
      const reports = await Report.listReports({ state, ownerId });
      return await context.valid('report:read', reports);
    },
    async report(_: {}, {id, slug}: {id?: string, slug?: string}, context: GraphQLContext) {
      context.log.info('Calling resolver report(%j)', {id, slug});
      let report;
      if (id) {
        report = await Report.getAsync(id);
      } else if (slug) {
        report = await Report.findBySlug(slug);
      }

      context.log.silly('Finished resolver report(%j) => %j', {id, slug}, report ? report.get() : 'null');
      if (report) {
        return await context.valid('report:read', report);
      } else  {
        throw new NotFoundError({data: {slug, id, resourceType: 'Report'}});
      }
    }
  },
  Mutation: {
    async createReport(
      _: null | undefined, {title, subtitle, content, userSampleRequirements}: ReportCreateArgs, context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid('report:create',
        new Report({
          ownerId: context.userId,
          content, title, subtitle, userSampleRequirements
        })
      );
      return await report.saveAsync();
    },
    async updateReport(
      _: null | undefined,
      {id, title, subtitle, content}: ReportUpdateArgs,
      context: GraphQLContext
    ) {
      const report = <Report> await context.valid(
        'report:update',
        await Report.getAsync(id)
      );
      if (title) {
        report.set({title});
      }
      if (subtitle) {
        report.set({subtitle});
      }
      if (content) {
        report.set({content});
      }
      return await report.updateAsync();
    },
    async publishReport(
      _: null | undefined, 
      {id}: {id: string}, 
      context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid(
        'report:publish',
        await Report.getAsync(id)
      );
      return await report.publish();
    }
  },
  Report: {
    ...GraphQLContext.dynamoAttributeResolver<ReportAttributes>('report', {
      // structured as { graphQLField: dynamoDBAttribute, ... }
      id: 'id',
      ownerId: 'ownerId',
      slug: 'slug',
      title: 'title',
      subtitle: 'subtitle',
      content: 'content'
      // variantIndexes: 'variantIndexes'
    }), 
    ...GraphQLContext.propertyResolver('report', {
      personalization(
        report: Report, { userId }: IContext, context: GraphQLContext
      ): Promise<Personalization> {
        userId = userId || context.userId;
        const personalizer = new Personalizer(report, userId);
        return personalizer.personalize();
      }
    })
  }
};

// check the exported resolver object matches the IResolvers type:
export const checkIResolverType: IResolvers = resolvers;
