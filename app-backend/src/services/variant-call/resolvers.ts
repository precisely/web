/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
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
      'callSetId', 'altBases', 'refBases', 'genotype', 'start', 'end', 'genotype',
      'genotypeLikelihood', 'filter', 'rsId', 'gene', 'zygosity', 'refVersion', 'geneStart', 'geneEnd'
    ])
  }
};
