/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { IResolvers } from 'graphql-tools';
import {ReducedElement} from 'smart-report';

import { IContext } from 'accesscontrol-plus';

import { GraphQLContext, accessControl } from 'src/services/graphql';

import {Report, ReportState, ReportAttributes} from './models';
import {Personalizer} from './services/smart-report';
import { UserSampleRequirement } from 'src/services/user-sample/external';

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
  title: string;
  content: string;
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
      context.log.info('Report resolver(%j)', {id, slug});
      let report;
      if (id) {
        report = await Report.getAsync(id);
      } else if (slug) {
        report = await Report.findBySlug(slug);
      }
      // context.log.silly('Report resolver(%j) => %j', {id, slug}, report ? report.get() : 'null');
      
      return report && await context.valid('report:read', report);
    }
  },
  Mutation: {
    async createReport(
      _: null | undefined, {title, content, userSampleRequirements}: ReportCreateArgs, context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid('report:create',
        new Report({
          ownerId: context.userId,
          content, title, userSampleRequirements
        })
      );
      return await report.saveAsync();
    },
    async updateReport(
      _: null | undefined,
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
      content: 'content'
      // variantIndexes: 'variantIndexes'
    }), 
    ...GraphQLContext.propertyResolver('report', {
      personalization(
        report: Report, { userId }: IContext, context: GraphQLContext
    ): Promise<ReducedElement[]> {
        userId = userId || context.userId;
        const personalizer = new Personalizer(report, userId);
        const result = personalizer.personalize();
        return result;
      }
    })
  }
};

// check the exported resolver object matches the IResolvers type:
export const checkIResolverType: IResolvers = resolvers;
