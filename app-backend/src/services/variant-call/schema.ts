/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import gql from 'graphql-tag';

export default [gql`
type VariantCall {
  userId: String,
  variantId: String,

  sampleSource: String,
  sampleId: String,
  
  refName: String,
  refVersion: String,
  
  start: Int,
  
  altBases: [String],
  refBases: String,
  
  genotype: [Int],
  genotypeLikelihoods: [Float],
  altBaseDosages: [Float]

  imputed: String,
  directRead: String,

  rsId: String,
  gene: String,
  geneStart: Int,
  geneEnd: Int,
  zygosity: String,

  createdAt: String,
  updatedAt: String
}`];
