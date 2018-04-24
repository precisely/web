/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import {graphqlLambda} from 'apollo-server-lambda';
// import {graphiqlLambda} from 'apollo-server-lambda';
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

  withCORS(handler, event, context, callback);
};

function withCORS(handler: Handler, event: APIGatewayEvent, context: Context, callback: Callback) {
  log.info('APIGateway event: ', event);
  // tslint:disable-next-line
  const callbackFilter = function (error: Error, output: any ) {
    Object.assign(output.headers, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Credentials' : true // Required for cookies, authorization headers with HTTPS
    });
    callback(error, output);
  };

  handler(event, context, callbackFilter);
}

export const playgroundHandler: Handler = function (event: APIGatewayEvent, context: Context, callback: Callback) {
  // tslint:disable-next-line
  const handler = lambdaPlayground({
    endpoint: `${process.env.GRAPHQL_API_PATH}`,
    htmlTitle: (
      process.env.STAGE !== 'prod' ?
      `${process.env.STAGE}:Precise.ly GraphQL Playground`
      : `Precise.ly GraphQL Playground`
    )
  });

  withCORS(handler, event, context, callback);
};

// export const graphiqlHandler: Handler = function (event: APIGatewayEvent, context: Context, callback: Callback) {
//   // tslint:disable-next-line
//   const handler = graphiqlLambda({ endpointURL: process.env.GRAPHQL_API_PATH });

//   withCORS(handler, event, context, callback);
// };
