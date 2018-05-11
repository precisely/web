/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {VariantCall, VariantCallAttributes} from './models';
import {dynamoFieldResolver} from 'src/graphql-utils';

export const resolvers = {
  VariantCall: {
    ... dynamoFieldResolver<VariantCallAttributes>([
      'callSetId', 'alternateBases', 'referenceBases', 'genotype',
      'genotypeLikelihood', 'filter', 'rsId', 'gene', 'zygosity'
    ]),
    start(vc: VariantCall) { return  vc.start; },
    end(vc: VariantCall) { return vc.end; }
  }
};
