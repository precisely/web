import * as SurveyFixtures from './fixtures/simple';
import { AccessDeniedError } from 'src/common/errors';
import { GraphQLContext } from 'src/services/graphql';
import { Survey, SurveyVersion } from './models';
import { destroyFixtures, resetAllTables } from 'src/common/fixtures';
import { makeContext } from 'src/services/graphql/test-helpers';
import { resolvers } from './resolvers';

describe('survey resolver', () => {

  beforeAll(resetAllTables);
  afterAll(destroyFixtures);

  const contextAdmin = makeContext({userId: 'admin-id', roles: ['admin']});
  const contextAuthor = makeContext({userId: 'owner-id-1', roles: ['author']});
  const contextUser = makeContext({userId: 'user-id', roles: ['user']});

  describe('query: survey', () => {

    beforeAll(SurveyFixtures.addSimpleFixtures);

    it('should read a fixture survey', async () => {
      const surveyFixture = SurveyFixtures.surveys[0];
      const survey = <Survey> await resolvers.Query.survey(
        {},
        {id: surveyFixture.get('id')},
        contextUser
      );
      expect(survey.get('title')).toEqual(surveyFixture.get('title'));
    });

  });

  describe('mutation: saveSurvey', () => {

    // NB: This is a stateful test suite. Test order matters.

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

  describe.only('mutation: publishSurvey', () => {

    // NB: This is a stateful test suite. Test order matters.

    beforeAll(SurveyFixtures.addSimpleFixtures);

    const surveyFixture = SurveyFixtures.surveys[0];
    const surveyId = surveyFixture.get('id');

    it('should take an existing survey and publish it', async () => {
      const draftVersionId = surveyFixture.get('draftVersionId');
      const surveyWithPublishedDraft = await resolvers.Mutation.publishSurvey(
        null,
        {id: surveyId},
        contextAdmin
      );
      expect(surveyWithPublishedDraft.get('draftVersionId')).toBeUndefined();
      expect(surveyWithPublishedDraft.get('currentPublishedVersionId')).toEqual(draftVersionId);
      expect(surveyWithPublishedDraft.get('publishedVersionIds')).toEqual([draftVersionId]);
    });

    it('should update the survey and republish it', async () => {
      const survey = await Survey.getAsync(surveyId);
      const newTitle = 'great new title';
      const newQuestions = {ten: 10, eleven: 11};
      // change draft questions after publication
      const updatedSurvey = await resolvers.Mutation.saveSurvey(
        null,
        {
          id: surveyId,
          title: newTitle,
          questions: newQuestions
        },
        contextAuthor
      );
      expect(updatedSurvey.get('id')).toEqual(surveyId);
      expect(updatedSurvey.get('draftVersionId')).not.toBeUndefined();
      expect(updatedSurvey.get('draftVersionId')).not.toEqual(surveyFixture.get('draftVersionId'));
      expect(updatedSurvey.get('title')).toEqual(newTitle);
      const newDraft = await SurveyVersion.getAsync(surveyId, updatedSurvey.get('draftVersionId'));
      expect(newDraft.get('questions')).toEqual(newQuestions);
      // republish
      await resolvers.Mutation.publishSurvey(
        null,
        {id: surveyId},
        contextAuthor
      );
      const reloadedSurvey = await Survey.getAsync(surveyId);
      expect(reloadedSurvey.get('draftVersionId')).toBeUndefined();
      expect(reloadedSurvey.get('currentPublishedVersionId')).toEqual(newDraft.get('versionId'));
      expect(reloadedSurvey.get('publishedVersionIds')).toEqual([surveyFixture.get('draftVersionId'), newDraft.get('versionId')]);
    });

  });

  describe('system test', () => {

    // NB: This is a stateful test suite. Test order matters.

    let surveyId: string;

    // FIXME: Write a test which exercises the system as a whole.

  });

});
