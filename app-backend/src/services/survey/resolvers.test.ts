import { AccessDeniedError } from 'src/common/errors';
import { GraphQLContext } from 'src/services/graphql';
import { Survey, SurveyVersion } from './models';
import { destroyFixtures, resetAllTables } from 'src/common/fixtures';
import { makeContext } from 'src/services/graphql/test-helpers';
import { resolvers } from './resolvers';

describe('survey resolver', () => {

  beforeAll(resetAllTables);
  afterAll(destroyFixtures);

  describe('saveSurvey', () => {

    const contextAuthor = makeContext({userId: 'author-id', roles: ['author']});
    const contextUser = makeContext({userId: 'user-id', roles: ['user']});
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

    it('should update questions in a survey', async () => {
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

});
