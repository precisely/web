/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {VariantCallAttributes} from './models';
import {GraphQLContext} from 'src/services/graphql';

export const resolvers = {
  VariantCall: {
    ... GraphQLContext.dynamoAttributeResolver<VariantCallAttributes>('variant-call', [
      'callSetId', 'alternateBases', 'referenceBases', 'genotype',
      'genotypeLikelihood', 'filter', 'rsId', 'gene', 'zygosity'
    ]),
    ... GraphQLContext.propertyResolver('variant-call', [ 'start', 'end'])
  }
};
