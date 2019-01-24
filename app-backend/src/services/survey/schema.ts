import gql from 'graphql-tag';


export default [gql`

  type Survey {
    id: String!,
    title: String!,
    ownerId: String!,
    currentPublishedVersionId: String,
    draftVersionId: String,
    currentPublishedVersion: SurveyVersion,
    draftVersion: SurveyVersion,
    versions: [SurveyVersion]!
  }

  type SurveyVersion {
    surveyId: String!,
    versionId: String!,
    questions: JSON!
  }

  enum SurveyState {
    published,
    draft,
    all
  }

  extend type Query {
    survey(id: String): Survey,
    surveys(state: SurveyState): [Survey]
  }

  extend type Mutation {
    saveSurvey(id: String!, title: String!): Survey
  }

`];
