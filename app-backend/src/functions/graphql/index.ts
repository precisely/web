/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

// import lambdaPlayground from 'graphql-playground-middleware-lambda';
import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import {graphqlLambda, graphiqlLambda} from 'apollo-server-lambda';
import {makeExecutableSchema} from 'graphql-tools';

import preciselyTypeDefs from 'src/modules/schema.graphql';
import {resolvers} from 'src/modules/resolvers';
import {log} from 'src/logger';

import { ResolverContext } from './resolver-context';

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

export const graphiqlHandler: Handler =  graphiqlLambda({
    endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/production/graphql',
});

// export const playgroundHandler: Handler = lambdaPlayground({ endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT });

// export const graphiqlHandler: Handler = graphiqlLambda({
//   endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/production/graphql',
// });
