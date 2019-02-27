import * as SurveyFixtures from './fixtures/simple';
import { AccessDeniedError, NotFoundError } from 'src/common/errors';
import { GraphQLContext } from 'src/services/graphql';
import { Survey, SurveyVersion } from './models';
import { destroyFixtures, resetAllTables } from 'src/common/fixtures';
import { makeContext } from 'src/services/graphql/test-helpers';
import { resolvers } from './resolvers';

describe('survey resolver', () => {

  beforeAll(resetAllTables);
  beforeEach(SurveyFixtures.addSimpleFixtures);
  afterEach(destroyFixtures);

  const contextAdmin = makeContext({userId: 'admin-id', roles: ['admin']});
  const contextAuthor = makeContext({userId: 'owner-id-1', roles: ['author']});
  const contextUser = makeContext({userId: 'user-id', roles: ['user']});

  describe('query: survey', () => {

    it('should read a fixture survey', async () => {
      const surveyFixture = SurveyFixtures.surveys[0];
      const survey = <Survey> await resolvers.Query.survey(
        {},
        {id: surveyFixture.get('id')},
        contextUser
      );
      expect(survey.get('title')).toEqual(surveyFixture.get('title'));
    });

    it('should not read a deleted survey', async () => {
      const deletedSurveyId = '7f5784a0-81e7-4db6-9546-060ef8110d0b';
      const surveyFixture = await Survey.getAsync(deletedSurveyId);
      expect(surveyFixture).toBeDefined();
      const promise = resolvers.Query.survey(
        {},
        {id: deletedSurveyId},
        contextUser
      );
      await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });

  });

  describe('tests query: surveys (multiple)', () => {

    it('should return one published survey', async () => {
      const surveys = await resolvers.Query.surveys(
        {},
        {state: 'published'},
        contextUser
      );
      expect(surveys).toHaveLength(1);
    });

    it('should return two draft surveys', async () => {
      const surveys = await resolvers.Query.surveys(
        {},
        {state: 'draft'},
        contextUser
      );
      expect(surveys).toHaveLength(2);
    });

    it('should return three total surveys', async () => {
      const surveys = await resolvers.Query.surveys(
        {},
        {state: 'all'},
        contextUser
      );
      expect(surveys).toHaveLength(3);
    });

  });

  describe('mutation: deleteSurvey', () => {

    it('should delete an existing survey from the fixtures', async () => {
      const surveyId = '7c79621e-1ebf-49f7-a209-a1feb4b6e6be';
      const deleteResult = await resolvers.Mutation.deleteSurvey(
        null,
        {id: surveyId},
        contextAdmin
      );
      expect(deleteResult).toEqual(true);
      // load the survey object and check it
      const deletedSurvey = await Survey.getAsync(surveyId);
      expect(deletedSurvey.attrs.isDeleted).toEqual(true);
      // now check that it does not come back in the surveys query
      const surveys = await resolvers.Query.surveys(
        {},
        {state: 'all'},
        contextUser
      );
      expect(surveys).toHaveLength(2);
    });

  });

  describe('mutation: saveSurvey', () => {

    let surveyId: string;

    it('should create a new survey along with a draft', async () => {
      const questions = {one: 1, two: 2};
      const survey = await resolvers.Mutation.saveSurvey(
        null,
        {
          title: 'new survey',
          questions
        },
        contextAuthor
      );
      surveyId = survey.get('id');
      const draftVersion = await SurveyVersion.getAsync(survey.get('id'), survey.get('draftVersionId'));
      expect(survey.get('id')).toEqual(draftVersion.get('surveyId'));
      expect(draftVersion.get('questions')).toEqual(questions);
    });

    it('should retrieve a saved survey', async () => {
      const survey = await Survey.getAsync(surveyId);
      expect(survey).toBeInstanceOf(Survey);
    });

    it('should update the title of the survey', async () => {
      const newSurveyTitle = 'new survey renamed';
      const survey = await resolvers.Mutation.saveSurvey(
        null,
        {
          id: surveyId,
          title: newSurveyTitle
        },
        contextAuthor
      );
      const surveyReloaded = await Survey.getAsync(surveyId);
      expect(surveyReloaded.get('title')).toEqual(newSurveyTitle);
    });

    it('should update survey questions', async () => {
      const newQuestions = {
        three: 3,
        four: 4
      };
      const survey = await resolvers.Mutation.saveSurvey(
        null,
        {
          id: surveyId,
          questions: newQuestions
        },
        contextAuthor
      );
      const surveyReloaded = await Survey.getAsync(surveyId);
      const draftVersion = await SurveyVersion.getAsync(surveyReloaded.get('id'), surveyReloaded.get('draftVersionId'));
      expect(draftVersion.get('questions')).toEqual(newQuestions);
    });

    it('should update survey questions and title in one mutation', async () => {
      const newSurveyTitle = 'new survey renamed again';
      const newQuestions = {
        five: 5,
        six: 6
      };
      const survey = await resolvers.Mutation.saveSurvey(
        null,
        {
          id: surveyId,
          title: newSurveyTitle,
          questions: newQuestions
        },
        contextAuthor
      );
      const surveyReloaded = await Survey.getAsync(surveyId);
      const draftVersion = await SurveyVersion.getAsync(surveyReloaded.get('id'), surveyReloaded.get('draftVersionId'));
      expect(surveyReloaded.get('title')).toEqual(newSurveyTitle);
      expect(draftVersion.get('questions')).toEqual(newQuestions);
    });

    it('should throw an error if the user is not an author', async () => {
      const promise = resolvers.Mutation.saveSurvey(
        null,
        {
          title: 'this will fail',
          questions: {x: 1}
        },
        contextUser
      );
      await expect(promise).rejects.toBeInstanceOf(AccessDeniedError);
      await expect(promise).rejects.toHaveProperty('data.scope', 'survey:create');
    });

  });

  describe('mutation: publishSurvey', async () => {

    let surveyId: string;
    let draftVersionId1: string | undefined;
    let draftVersionId2: string | undefined;
    const title1 = 'new survey';
    const title2 = 'great new title';
    const questions1 = {one: 1, two: 2};
    const questions2 = {ten: 10, eleven: 11};

    it('should first save the survey', async () => {
      const survey = await resolvers.Mutation.saveSurvey(
        null,
        {
          title: title1,
          questions: questions1
        },
        contextAuthor
      );
      surveyId = survey.get('id');
      draftVersionId1 = survey.get('draftVersionId');
    });

    it('should publish the survey', async () => {
      const survey = await resolvers.Mutation.publishSurvey(
        null,
        {id: surveyId},
        contextAuthor
      );
      expect(survey.get('draftVersionId')).toBeUndefined();
      expect(survey.get('currentPublishedVersionId')).toEqual(draftVersionId1);
      expect(survey.get('publishedVersionIds')).toEqual([draftVersionId1]);
      const version = await SurveyVersion.getAsync(surveyId, draftVersionId1);
      expect(version).not.toBeUndefined();
    });

    it('should update the survey after publication', async () => {
      const survey = await Survey.getAsync(surveyId);
      await resolvers.Mutation.saveSurvey(
        null,
        {
          id: surveyId,
          title: title2,
          questions: questions2
        },
        contextAuthor
      );
      const reloadedSurvey = await Survey.getAsync(surveyId);
      draftVersionId2 = reloadedSurvey.get('draftVersionId');
      expect(survey).not.toEqual(reloadedSurvey);
      expect(reloadedSurvey.get('title')).toEqual(title2);
      expect(reloadedSurvey.get('draftVersionId')).not.toBeUndefined();
      expect(reloadedSurvey.get('draftVersionId')).not.toEqual(draftVersionId1);
      expect(reloadedSurvey.get('draftVersionId')).not.toEqual(reloadedSurvey.get('currentPublishedVersionId'));
      expect(reloadedSurvey.get('currentPublishedVersionId')).not.toContain(draftVersionId2);
      const oldDraft = await SurveyVersion.getAsync(surveyId, draftVersionId1);
      expect(oldDraft.get('questions')).toEqual(questions1);
      const newDraft = await SurveyVersion.getAsync(surveyId, draftVersionId2);
      expect(newDraft.get('questions')).toEqual(questions2);
    });

    it('should republish the survey after draft changed', async () => {
      await resolvers.Mutation.publishSurvey(
        null,
        {id: surveyId},
        contextAuthor
      );
      const reloadedSurvey = await Survey.getAsync(surveyId);
      expect(reloadedSurvey.get('draftVersionId')).toBeUndefined();
      expect(reloadedSurvey.get('currentPublishedVersionId')).toEqual(draftVersionId2);
      expect(reloadedSurvey.get('publishedVersionIds')).toEqual([draftVersionId1, draftVersionId2]);
      const reloadedSurveyPublishedVersion = await SurveyVersion.getAsync(
        surveyId,
        reloadedSurvey.get('currentPublishedVersionId'));
      expect(reloadedSurveyPublishedVersion.get('versionId')).not.toEqual(draftVersionId1);
      expect(reloadedSurveyPublishedVersion.get('versionId')).toEqual(draftVersionId2);
      const reloadedSurveyOldPublishedVersion = await SurveyVersion.getAsync(surveyId, draftVersionId1);
      expect(reloadedSurveyOldPublishedVersion.get('versionId')).toEqual(draftVersionId1);
      expect(reloadedSurveyPublishedVersion).not.toEqual(reloadedSurveyOldPublishedVersion);
    });

  });

});
