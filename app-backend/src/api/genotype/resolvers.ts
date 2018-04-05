/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import {Genotype} from './models';

export const resolvers = {
  Query: {
    // no top level queries
  },
  Mutation: {
    // no mutations
  },
  Genotype: {
    sampleId: (genotype: Genotype) => genotype.sampleId,
    source: (genotype: Genotype) => genotype.source,
    gene: (genotype: Genotype) => genotype.gene,
    variantCall: (genotype: Genotype) => genotype.variantCall,
    zygosity: (genotype: Genotype) => genotype.zygosity,
    startBase: (genotype: Genotype) => genotype.startBase,
    chromosome: (genotype: Genotype) => genotype.chromosome,
    variantType: (genotype: Genotype) => genotype.variantType,
    quality: (genotype: Genotype) => genotype.quality
  }
};
