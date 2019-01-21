/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import {resolvers as surveyResolvers} from 'src/services/survey';
import {resolvers as variantCallResolvers} from 'src/services/variant-call';
import {resolvers as reportResolvers} from 'src/services/report';
import {merge} from 'lodash';
import * as GraphQLJSON from 'graphql-type-json';

export const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  ...[
    surveyResolvers,
    variantCallResolvers,
    reportResolvers
  ].reduce(merge)
};
