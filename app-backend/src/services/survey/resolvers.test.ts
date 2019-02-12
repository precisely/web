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

  const contextAdmin = makeContext({userId: 'author-id', roles: ['admin']});
  const contextAuthor = makeContext({userId: 'author-id', roles: ['author']});
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

    // This is a stateful test suite. It creates a survey in the first test,
    // and modifies it through successive tests.

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

  describe('mutation: publishSurvey', () => {

    beforeAll(SurveyFixtures.addSimpleFixtures);

    it('should take an existing survey and publish it', async () => {
      const surveyFixture = SurveyFixtures.surveys[0];
      const draftVersionId = surveyFixture.get('draftVersionId');
      const surveyWithPublishedDraft = await resolvers.Mutation.publishSurvey(
        null,
        {id: surveyFixture.get('id')},
        contextAdmin
      );
      expect(surveyWithPublishedDraft.get('draftVersionId')).toBeUndefined();
      expect(surveyWithPublishedDraft.get('currentPublishedVersionId')).toEqual(draftVersionId);
      expect(surveyWithPublishedDraft.get('publishedVersionIds')).toEqual([draftVersionId]);
    });

  });

  describe('system test', () => {
    // FIXME: Write a test which exercises the system as a whole.
  });

});
