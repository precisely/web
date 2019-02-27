import { Survey, SurveyVersion } from '../../models';
import { addFixtures } from 'src/common/fixtures';

export const surveys = [
  new Survey({
    id: '8d6f5c9f-1243-4255-9758-a5f1401bb247',
    title: 'test survey 1 (draft only)',
    ownerId: 'owner-id-1',
    draftVersionId: '2019-02-01T01:33:53.645Z'
  }),
  new Survey({
    id: '08a6eedb-84c0-4731-9177-7647b5eddb72',
    title: 'test survey 2 (draft only)',
    ownerId: 'owner-id-1',
    draftVersionId: '2019-01-29T23:46:41.088Z'
  }),
  new Survey({
    id: '7c79621e-1ebf-49f7-a209-a1feb4b6e6be',
    title: 'test survey 3 (published)',
    ownerId: 'owner-id-1',
    currentPublishedVersionId: '2019-02-21T01:31:21.681Z',
    publishedVersionIds: ['2019-02-21T01:31:21.681Z']
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
  }),
  new SurveyVersion({
    surveyId: '7c79621e-1ebf-49f7-a209-a1feb4b6e6be',
    versionId: '2019-02-21T01:31:21.681Z',
    questions: {
      three: 3,
      four: 4
    }
  })
];

export async function addSimpleFixtures() {
  addFixtures(...surveys);
  addFixtures(...surveyVersions);
};
