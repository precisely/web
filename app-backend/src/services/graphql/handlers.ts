/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import {graphqlLambda} from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import {makeExecutableSchema} from 'graphql-tools';

import preciselyTypeDefs from 'src/services/schema.graphql';
import {resolvers} from 'src/services/resolvers';
import {log} from 'src/logger';

import { ResolverContext } from 'src/graphql-utils';

const PreciselySchema = makeExecutableSchema({
  typeDefs: preciselyTypeDefs,
  resolvers,
  logger: log
});

export const apiHandler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const handler = graphqlLambda({
    schema: PreciselySchema,
    tracing: true,
    rootValue: null,
    context: new ResolverContext(event, context)
  });

  handler(event, context, callback);
};

export const playgroundHandler: Handler = lambdaPlayground({
  endpoint: process.env.GRAPHQL_API_PATH
});
