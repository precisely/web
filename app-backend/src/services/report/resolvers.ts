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

import { GraphQLContext, accessControl } from 'src/services/graphql';

import {Report, ReportState, ReportAttributes} from './models';
import {Personalizer} from './services/personalizer';

function reportPublished({resource}: IContext) {
  return resource.get('state') === 'published';
}

function userOwnsResource({user, resource}: IContext) {
  return user.id === resource.get('ownerId');
}

function userIdArgumentIsUser({user, args}: IContext) {
  return args.userId === user.id;
}

// tslint:disable no-unused-expression
accessControl
  .grant('user')
    .resource('report')
      .read.onFields('*', '!content', '!variantCallIndexes', '!personalization').where(reportPublished)
      .read.onFields('personalization').where(userIdArgumentIsUser)
  .grant('author')
    .resource('report')
      .read.onFields('*').where(userOwnsResource)      
      .create
      .update.where(userOwnsResource);
// tslint:enable no-unused-expressions

export interface ReportCreateArgs {
  title: string;
  content: string;
}

export interface ReportUpdateArgs extends Partial<ReportCreateArgs> {
  id: string;
}

export const resolvers = {
  Query: {
    async reports(_: Report, { state, ownerId }: { state?: ReportState, ownerId?: string }, context: GraphQLContext) {
      const reports = await Report.listReports({ state });
      return await context.valid('report:read', reports);
    },
    async report(_: {}, {id, slug}: {id?: string, slug?: string}, context: GraphQLContext) {
      let report;
      if (id) {
        report = await Report.getAsync(id);
      } else if (slug) {
        report = await Report.findBySlug(slug);
      }
      return report && await context.valid('report:read', report);
    }
  },
  Mutation: {
    async createReport(
      _: Report, {title, content}: ReportCreateArgs, context: GraphQLContext
    ): Promise<Report> {
      const report = <Report> await context.valid('report:create',
        new Report({
          ownerId: context.userId,
          content, title
        })
      );
      return await report.saveAsync();
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
      // structured as { graphQLField: dynamoDBAttribute, ... }
      id: 'id',
      ownerId: 'ownerId',
      slug: 'slug',
      title: 'title',
      content: 'content',
      variantCallIndexes: 'variantCallIndexes'
    }), 
    ...GraphQLContext.propertyResolver('report', {
      personalization(
        report: Report, { userId }: IContext, context: GraphQLContext
      ): Promise<ReducedElement[]> {
        userId = userId || context.userId;
        const personalizer = new Personalizer(report, userId);
        return personalizer.personalize();
      }
    })
  }
};

// check the exported resolver object matches the IResolvers type:
export const checkIResolverType: IResolvers = resolvers;
