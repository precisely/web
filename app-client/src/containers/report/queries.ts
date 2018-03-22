/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/* istanbul ignore next */
import gql from 'graphql-tag';

/* istanbul ignore next */
export const GetReport = gql`
  query getReport(
      $slug: String,
      $id: String,
      $userId: String!,
      $vendorDataType: String!,
      $limit: Int
  ) {
    report(
        id: $id,
        userId: $userId,
        vendorDataType: $vendorDataType,
        slug: $slug,
        limit: $limit
    ) {
      Items {
        attrs {
          slug,
          id,
          title,
          genes,
          parsed_content
        }
      },
      userData(limit: 10) {
        Items{
          attrs{
            gene,
            opaque_id,
            sample_id,
            quality,
            variant_call
          }
        },
      }
    }
  }
`;
