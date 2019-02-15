import { IContext } from 'accesscontrol-plus';
import { IResolvers } from 'graphql-tools';
import uuid = require('uuid');
import * as Luxon from 'luxon';

import { GraphQLContext, accessControl } from 'src/services/graphql';
import { NotFoundError } from 'src/common/errors';
import { SurveyVersion, SurveyVersionAttributes, Survey, SurveyAttributes } from './models';


// helpers

// TODO: report.userOwnsResource is identical
function userOwnsResource({user, resource}: IContext) {
  return user.id === resource.get('ownerId');
}


// access control

// tslint:disable no-unused-expression

accessControl
  .grant('admin')
  .resource('survey')
  .read
  .create
  .update;

accessControl
  .grant('user')
  .resource('survey')
  .read.onFields('*', '!draftVersionId', '!publishedVersionIds');

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

// tslint:enable no-unused-expressions


// resolver helper types

interface ISaveSurveyNewArgs {
  title: string,
  questions: object
}

interface ISaveSurveyUpdateArgs {
  id: string,
  title?: string,
  questions?: object
}

function isSaveSurveyUpdate(surveyArgs: ISaveSurveyNewArgs | ISaveSurveyUpdateArgs): surveyArgs is ISaveSurveyUpdateArgs {
  return (<ISaveSurveyUpdateArgs> surveyArgs).id !== undefined;
}

interface IPublishSurveyArgs {
  id: string
}


// actual resolver code
export const resolvers = {

  Query: {

    async survey(
      _: {},
      {id}: {id: string},
      context: GraphQLContext
    ) {
      const result = await Survey.getAsync(id);
      if (result) {
        return await context.valid('survey:read', result);
      } else {
        throw new NotFoundError({data: {id, resourceType: 'Survey'}});
      }
    }

  },

  Mutation: {

    async saveSurvey(
      _: null | undefined,
      args: ISaveSurveyNewArgs | ISaveSurveyUpdateArgs,
      context: GraphQLContext
    ) {
      // creating a brand new survey
      if (!isSaveSurveyUpdate(args)) {
        const id = uuid();
        const versionId = Luxon.DateTime.utc().toISO();
        const draftTmp = <SurveyVersion> await context.valid('survey:create', new SurveyVersion({
          surveyId: id,
          versionId,
          questions: args.questions
        }));
        const draft = await draftTmp.saveAsync();
        const surveyTmp = <Survey> await context.valid('survey:create', new Survey({
          id,
          title: args.title,
          ownerId: context.userId,
          draftVersionId: draft.get('versionId')
        }));
        return await surveyTmp.saveAsync();
      }
      // updating an existing survey
      else {
        const survey = <Survey> await context.valid('survey:update', await Survey.getAsync(args.id));
        if (!survey) {
          throw new NotFoundError({data: {id: args.id, resourceType: 'Survey'}});
        }
        // nasty logic to handle all cases
        let surveyNeedsSave = false;
        let draftNeedsSave = false;
        let draftVersionId = survey.get('draftVersionId');
        let draft =
          draftVersionId ?
          await SurveyVersion.getAsync(survey.get('id'), draftVersionId) :
          undefined;
        if (!draft) {
          draftVersionId = draftVersionId || Luxon.DateTime.utc().toISO();
          draft = new SurveyVersion({
            surveyId: survey.get('id'),
            versionId: draftVersionId,
            questions: {}
          });
          survey.attrs.draftVersionId = draftVersionId;
          draftNeedsSave = true;
          surveyNeedsSave = true;
        }
        if (args.questions) {
          draft.attrs.questions = args.questions;
          draftNeedsSave = true;
        }
        if (args.title) {
          survey.attrs.title = args.title;
          surveyNeedsSave = true;
        }
        if (draftNeedsSave) {
          await draft.saveAsync();
        }
        if (surveyNeedsSave) {
          await survey.saveAsync();
        }
        return survey;
      }
    },

    async publishSurvey(
      _: null | undefined,
      args: IPublishSurveyArgs,
      context: GraphQLContext
    ) {
      // TODO: Maybe this needs a separate survey:publish permission?
      const survey = <Survey> await context.valid('survey:update', await Survey.getAsync(args.id));
      if (!survey) {
        throw new NotFoundError({data: {id: args.id, resourceType: 'Survey'}});
      }
      const draftVersionId = survey.get('draftVersionId');
      if (!draftVersionId) {
        throw new NotFoundError({data: {resourceType: 'SurveyVersion'}});
      }
      const publishedVersionIds: string[] = survey.get('publishedVersionIds') || [];
      publishedVersionIds.push(draftVersionId);
      survey.attrs.publishedVersionIds = publishedVersionIds;
      survey.attrs.draftVersionId = undefined;
      survey.attrs.currentPublishedVersionId = draftVersionId;
      await survey.saveAsync();
      return survey;
    }

  },

  SurveyVersion: {
    ...GraphQLContext.dynamoAttributeResolver<SurveyVersionAttributes>('surveyVersion', {
      // structured as { graphQLField: dynamoDBAttribute, ... }
      surveyId: 'surveyId',
      versionId: 'versionId',
      questions: 'questions'
    })
  },

  Survey: {
    ...GraphQLContext.dynamoAttributeResolver<SurveyAttributes>('survey', {
      // structured as { graphQLField: dynamoDBAttribute, ... }
      id: 'id',
      title: 'title',
      ownerId: 'ownerId',
      currentPublishedVersionId: 'currentPublishedVersionId',
      draftVersionId: 'draftVersionId',
      publishedVersionIds: 'publishedVersionIds'
    }),
    ...GraphQLContext.propertyResolver('survey', {
      draftVersion(survey: Survey, { userId }: IContext, context: GraphQLContext): Promise<SurveyVersion> {
        return SurveyVersion.getAsync(survey.get('id'), survey.get('draftVersionId'));
      },
      currentPublishedVersion(survey: Survey, { userId }: IContext, context: GraphQLContext): Promise<SurveyVersion> {
        return SurveyVersion.getAsync(survey.get('id'), survey.get('currentPublishedVersionId'));
      },
      publishedVersions(survey: Survey, { userId }: IContext, context: GraphQLContext) {
        const surveyId = survey.get('id');
        const publishedVersionIds = survey.get('publishedVersionIds');
        if (publishedVersionIds) {
          return publishedVersionIds.map((versionId) => SurveyVersion.getAsync(surveyId, versionId));
        } else {
          return [];
        }
      }
    })
  }

};

export const checkIResolverType: IResolvers = resolvers;
