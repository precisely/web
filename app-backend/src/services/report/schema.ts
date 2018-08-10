import gql from 'graphql-tag';

export default [gql`
type Report {
  id: String,
  ownerId: String,
  title: String,
  slug: String,
  content: String,
  requiredVariants: [String],
  personalization(userId: String): JSON,
  createdAt: String,
  updatedAt: String
}

enum ReportState {
  published
  pending
  draft
}

extend type Query {
  reports(ownerId: String, state: ReportState): [Report],
  report(slug: String, id: String): Report,
}

extend type Mutation {
  createReport(slug: String!, title: String!, content: String!, genes: [String]): Report,
  updateReport(slug: String!, title: String!, content: String!, genes: [String]): Report,
}`];
