import { IContext } from 'accesscontrol-plus';
import { IResolvers } from 'graphql-tools';

import { GraphQLContext, accessControl } from 'src/services/graphql';
import { NotFoundError } from 'src/common/errors';
import { Survey, SurveyAttributes } from './models';


 // helpers

// TODO: report.userOwnsResource is identical
function userOwnsResource({user, resource}: IContext) {
  return user.id === resource.get('ownerId');
}


 // other stuff

// tslint:disable no-unused-expression

accessControl
  .grant('user')
  .resource('survey')
  .read.onFields('*', '!ownerId', '!draftVersionId', '!draftVersion');

accessControl
  .grant('user')
  .resource('surveyVersion')
  .read.onFields('*');

accessControl
  .grant('author')
  .resource('survey')
  .read.onFields('*').where(userOwnsResource) 
  .create
  .update.where(userOwnsResource);
// FIXME: Need an .action("...") specifier here?

accessControl
  .grant('author')
  .resource('surveyVersion')
  .read.onFields('*').where(userOwnsResource) 
  .create
  .update.where(userOwnsResource);
// FIXME: Need an .action("...") specifier here?

// tslint:enable no-unused-expressions


 // actual resolver code
export const resolvers = {

  Query: {

    async survey(
      _: {},
      {id}: {id: string},
      context: GraphQLContext
    ): Promise<Survey> {
      const result = await Survey.getAsync(id);
      if (result) {
        return await context.valid('survey:read', result);
      } else {
        throw new NotFoundError({data: {id, resourceType: 'Survey'}});
      }
    }

    /*
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
    */

  },

  Mutation: {

    async saveSurvey(
      _: null | undefined,
      {id, title}: any, // FIXME: Type.
      context: GraphQLContext
    ): Promise<Survey> {
      const actualId = id ? id : 'dc1';
      // FIXME: Validate context.
      const survey = new Survey({
        id: actualId,
        title,
        ownerId: context.userId
      });
      return await survey.saveAsync();
    }

    /*
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
    */

  },

  // FIXME: Implement Survey and SurveyVersion resolvers as below:

  Survey: {
    ...GraphQLContext.dynamoAttributeResolver<SurveyAttributes>('survey', {
      // structured as { graphQLField: dynamoDBAttribute, ... }
      id: 'id',
      title: 'title',
      ownerId: 'ownerId'
    })
  }

  /*
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
  */

};

export const checkIResolverType: IResolvers = resolvers;
