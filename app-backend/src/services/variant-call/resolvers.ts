/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {GraphQLContext, accessControl} from 'src/services/graphql';
import {VariantCallAttributes} from './models';
import { IContext } from 'accesscontrol-plus';

function userIdArgumentIsUserOrImplicit({args, user}: IContext) {
  return !args.userId || args.userId === user.id;
}

// tslint:disable no-unused-expression
accessControl
  // note: currently, reports can only be accessed by logged in users
  //       this might need to change when we make reports SEO-accessible
  .grant('user')
    .resource('variant-call')
      .read.onFields('*').where(userIdArgumentIsUserOrImplicit);
// tslint:enable no-unused-expressions

export const resolvers = {
  VariantCall: {
    ... GraphQLContext.dynamoAttributeResolver<VariantCallAttributes>('variant-call', [
      'sampleSource', 'refName', 'refVersion', 'sampleId', 'start', 'altBases', 'refBases', 'genotype',
      'genotypeLikelihoods', 'rsId', 'gene', 'geneStart', 'geneEnd', 
      'zygosity', 'imputed', 'directRead', 'altBaseDosages'
    ])
  }
};
