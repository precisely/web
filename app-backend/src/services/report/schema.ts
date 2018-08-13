/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:49:33 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:49:33 
 */

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