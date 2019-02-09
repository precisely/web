import { Survey, SurveyVersion } from '../../models';
import { addFixtures } from 'src/common/fixtures';

export const surveys = [
  new Survey({
    id: '8d6f5c9f-1243-4255-9758-a5f1401bb247',
    title: 'test survey 1',
    ownerId: 'owner-id-1',
    draftVersionId: '2019-02-01T01:33:53.645Z'
  }),
  new Survey({
    id: '08a6eedb-84c0-4731-9177-7647b5eddb72',
    title: 'test survey 2',
    ownerId: 'owner-id-1'
  })
];

export const surveyVersions = [
  new SurveyVersion({
    surveyId: '8d6f5c9f-1243-4255-9758-a5f1401bb247',
    versionId: '2019-02-01T01:33:53.645Z',
    questions: {
      five: 5,
      six: 6
    }
  }),
  new SurveyVersion({
    surveyId: '08a6eedb-84c0-4731-9177-7647b5eddb72',
    versionId: '2019-01-29T23:46:41.088Z',
    questions: {
      two: 2,
      one: 1
    }
  })
];

export async function addSimpleFixtures() {
  addFixtures(...surveys);
  addFixtures(...surveyVersions);
};
