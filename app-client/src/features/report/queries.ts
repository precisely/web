/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import gql from 'graphql-tag';

export const GetReports = gql`
  query ListReports($ownerId: String, $state: String) {
    reports(state: $state, ownerId: $ownerId) {
      id slug title draftContent publishedContent state
    }
  }
`;
