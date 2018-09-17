/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:43:09 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2018-08-10 09:43:09 
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
  end: Int,
  
  altBases: [String],
  refBases: String,
  
  genotype: [Int],
  genotypeLikelihood: [Int],
  filter: [String],

  rsId: String,
  gene: String,
  geneStart: Int,
  geneEnd: Int,
  zygosity: String,

  createdAt: String,
  updatedAt: String
}`];
