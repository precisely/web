/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {GraphQLContext} from 'src/services/graphql';
import {VariantCallAttributes} from './models';

export const resolvers = {
  VariantCall: {
    ... GraphQLContext.dynamoAttributeResolver<VariantCallAttributes>('variant-call', [
      'sampleType', 'refName', 'refVersion', 'sampleId', 'start', 'end', 'altBases', 'refBases', 'genotype',
      'genotypeLikelihood', 'filter', 'rsId', 'gene', 'geneStart', 'geneEnd', 
      'zygosity', 
    ])
  }
};
