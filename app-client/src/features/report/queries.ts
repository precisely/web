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
