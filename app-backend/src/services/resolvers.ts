/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import {resolvers as variantCallResolvers} from './variant-call';
import {resolvers as reportResolvers} from './report';
import {merge} from 'lodash';
import * as GraphQLJSON from 'graphql-type-json';

export const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  ...[
    variantCallResolvers,
    reportResolvers
  ].reduce(merge)
};
