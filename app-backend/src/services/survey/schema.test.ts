const cases = require('jest-in-case');
import { graphql, GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import typeDefs from 'src/services/schema';
import { Survey, SurveyVersion } from './models';

// mocked schema tests according to https://www.apollographql.com/docs/graphql-tools/mocking.html
describe('survey schema', () => {

  let mockSchema: GraphQLSchema;
  
  beforeEach(() => {
    mockSchema = makeExecutableSchema({ typeDefs });
    
    // Here we specify the return payloads of mocked types
    addMockFunctionsToSchema({
      schema: mockSchema,
      mocks: {
        Int: () => 1,
        Float: () => 2.2,
        String: () => 'str',
        Survey: () => new Survey({
          id: 'survey-id',
          title: 'Survey Title',
          ownerId: 'owner-id'
        }),
        SurveyVersion: () => new SurveyVersion({
          surveyId: 'survey-id',
          versionId: '2019-01-29T23:46:41.102Z',
          questions: {
            one: 1,
            two: 2
          }
        }),
        JSON: () => {
          return {
            one: 1,
            two: 2
          };
        }
      }
    });
  });

  describe('queries', () => {

    it('should allow full querying', async () => {
      const query = `query {
        survey(id: "survey-id") {
          id,
          title,
          ownerId,
          draftVersion {
            questions
          }
        }
      }`;
      const result = await graphql(mockSchema, query, null, {}, {});
      expect(result).toEqual({
        data: {
          survey: {
            id: 'str',
            title: 'str',
            ownerId: 'str',
            draftVersion: {
              questions: {
                one: 1,
                two: 2
              }
            }
          }
        }
      });
    });

  });

  describe('mutations', () => {

    it('should allow saving an intial save of a survey', async () => {
      const mutation = `mutation {
        saveSurvey(title: "test survey 2", questions: {
          one: 1,
          two: 2
        }) {
          id,
          title
        }
      }`;
      const result = await graphql(mockSchema, mutation, null, {}, {});
      expect(result).toEqual({
        data: {
          saveSurvey: {
            id: 'str',
            title: 'str'
          }
        }
      });
    });

    it('should allow updating the draft version of a survey', async () => {
      const mutation = `mutation {
        saveSurvey(id: "survey-id", title: "new title", questions: {
          three: 3,
          four: 4
        }) {
          id,
          title
        }
      }`;
      const result = await graphql(mockSchema, mutation, null, {}, {});
      expect(result).toEqual({
        data: {
          saveSurvey: {
            id: 'str',
            title: 'str'
          }
        }
      });
    });

  });

});
