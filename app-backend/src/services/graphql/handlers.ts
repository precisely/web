/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// tslint:disable:no-any

import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';

import {graphqlLambda} from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import {makeExecutableSchema} from 'graphql-tools';

import {resolvers} from 'src/services/resolvers';
import { makeLogger, Logger } from 'src/common/logger';
import { GraphQLContext } from './graphql-context';
import preciselyTypeDefs from 'src/services/schema';

export const apiHandler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const log = makeLogger(context.awsRequestId);
  const PreciselySchema = makeExecutableSchema({
    typeDefs: preciselyTypeDefs,
    resolvers,
    logger: { log(message: string) { log.info(message); } }
  });

  const handler = graphqlLambda({
    schema: PreciselySchema,
    tracing: true,
    rootValue: null,
    context: new GraphQLContext(event, context)
  });
  log.silly('graphql.apiHandler EVENT: %j\t\tCONTEXT: %j', event, context);
  withCORS(handler, event, context, (err, result) => {
    if (err) {
      log.error('graphql.apiHandler error', err);
    } else {
      log.info('graphql.apiHandler result %j', result);
    }
    callback(err, result);
  });
};

export function playgroundTitle(stage?: string) {
  return stage !== 'prod' 
    ? `${stage}:Precise.ly GraphQL Playground`
    : `Precise.ly GraphQL Playground`;
} 

export const playgroundHandler: Handler = function (event: APIGatewayEvent, context: Context, callback: Callback) {
  const handler = lambdaPlayground({
    endpoint: process.env.GRAPHQL_API_PATH,
    htmlTitle: playgroundTitle(process.env.STAGE)
  });
  withCORS(handler, event, context, callback);
};

// export const graphiqlHandler: Handler = function (event: APIGatewayEvent, context: Context, callback: Callback) {
//   const handler = graphiqlLambda({ endpointURL: process.env.GRAPHQL_API_PATH });

//   withCORS(handler, event, context, callback);
// };

function withCORS(handler: Handler, event: APIGatewayEvent, context: Context, callback: Callback) {
  const log = makeLogger(context.awsRequestId);
  log.debug('APIGateway event: %j, context: %j', event, context);
  const callbackFilter = function (error: Error, output: any ) {
    if (output) {
      output.headers = output.headers || {};
      Object.assign(output.headers, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Credentials' : true // Required for cookies, authorization headers with HTTPS
      });
    }
    callback(error, output);
  };

  handler(event, context, callbackFilter);
}
