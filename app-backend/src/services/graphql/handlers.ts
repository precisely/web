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
import {formatError} from 'apollo-errors';

import {resolvers} from 'src/services/resolvers';
import { makeLogger } from 'src/common/logger';
import { GraphQLContext } from './graphql-context';
import preciselyTypeDefs from 'src/services/schema';

export function apiHandler(event: APIGatewayEvent, context: Context, callback: Callback) {
  try {
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
      context: new GraphQLContext(event, context),
      formatError
    });
    log.silly('graphql.apiHandler event: %j\t\tcontext: %j', event, context);
    withCORS(handler, event, context, (err, result) => {
      if (err) {
        log.error('graphql.apiHandler error', err);
      } else {
        log.info('graphql.apiHandler result %j', result);
      }
      callback(err, result);
    });
  } catch (e) {
    callback(e);
  }
}

export function playgroundTitle(stage?: string) {
  return stage !== 'prod' 
    ? `${stage}:Precise.ly GraphQL Playground`
    : `Precise.ly GraphQL Playground`;
} 

export function playgroundHandler(event: APIGatewayEvent, context: Context, callback: Callback) {
  try {
    const handler = lambdaPlayground({
      endpoint: process.env.GRAPHQL_API_PATH,
      htmlTitle: playgroundTitle(process.env.STAGE)
    });
    
    withCORS(handler, event, context, callback);
  } catch (e) {
    callback(e);
  }
}

function withCORS(handler: Handler, event: APIGatewayEvent, context: Context, callback: Callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const log = makeLogger(context.awsRequestId);
  const callbackFilter = function (error: Error, output?: any ) {
    if (output) {
      output.headers = output.headers || {};
      Object.assign(output.headers, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Credentials' : true // Required for cookies, authorization headers with HTTPS
      });
    }
    if (error) {
      log.info('%s error: %j', handler.name, error);
    } else {
      log.silly('%s result: %j', handler.name, output);
    }
    callback(error, output);
  };

  try {
    log.debug('%s event: %j, context: %j', handler.name, event, context);
    return handler(event, context, callbackFilter);
  } catch (e) {
    return callbackFilter(e);
  }
}
