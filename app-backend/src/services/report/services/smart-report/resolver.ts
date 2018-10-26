/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { IResolvers } from 'graphql-tools';

import { IContext } from 'accesscontrol-plus';

import { GraphQLContext, accessControl } from 'src/services/graphql';

function userCanViewPersonalization({args, user}: IContext) {
  return !args.userId || args.userId === user.id;
}

// tslint:disable no-unused-expression
accessControl
  .grant('public')
    .resource('personalization')
      .read.onFields('status', 'elements');
  // note: the public personalization 
// tslint:enable no-unused-expressions

export const resolvers = {
  Personalization: {
    ...GraphQLContext.propertyResolver('personalization', ['status', 'elements'])
  }
};

// check the exported resolver object matches the IResolvers type:
export const checkIResolverType: IResolvers = resolvers;
