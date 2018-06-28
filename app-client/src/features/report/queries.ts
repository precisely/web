/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import gql from 'graphql-tag';

export const GetReport = gql`
  query Report($slug: String!) {
    report(slug: $slug) {
      slug
      id
      title
      genes
      rawContent
      parsedContent
      userData {
        genotypes {
          opaqueId
          quality
          gene
          zygosity
          variantCall
        }
      }
    }
  }
`;
