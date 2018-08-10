/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
// tslint:disable no-any no-empty

import { 
  APIGatewayEventRequestContext, 
  Context as LambdaContext, 
  APIGatewayEvent, 
  AuthResponseContext 
} from 'aws-lambda';
import { GraphQLContext } from './graphql-context';

export function makeContext({ userId, roles }: {userId?: string, roles?: string[]}): GraphQLContext {
  roles = roles || [];
  return new GraphQLContext(makeEvent({ authorizer: {
    principalId: userId,
    roles: roles.join(',')
  }}), makeLambdaContext());
}

export function makeEvent({
  authorizer = { principalId: '', roles: ''},
  headers = { Authorization: 'Bearer abcd' },
  body = '',
  path = '/graphql',
  requestId = 'req-id-123',
  httpMethod = 'POST',
  resourcePath = '/graphql',
  resourceId = 'resource-id-123',
  resource = '/graphql'
}: {
  authorizer?: AuthResponseContext,
  headers?: { [name: string]: string },
  body?: string,
  resourcePath?: string,
  requestId?: string,
  path?: string,
  resource?: string,
  httpMethod?: string,
  resourceId?: string
}): APIGatewayEvent {
  const requestContext: APIGatewayEventRequestContext = {
    accountId: '1234',
    apiId: 'asdf',
    authorizer: authorizer,
    httpMethod: 'POST',
    identity: {
      accessKey: '',
      accountId: '',
      apiKey: '',
      apiKeyId: '',
      caller: '',
      cognitoAuthenticationProvider: '',
      cognitoAuthenticationType: '',
      cognitoIdentityId: '',
      cognitoIdentityPoolId: '',
      sourceIp: '',
      user: '',
      userAgent: '',
      userArn: ''
    },
    stage: '',
    requestId,
    requestTimeEpoch: 123123123,
    resourceId,
    resourcePath,

  };
  const event: APIGatewayEvent = {
    body,
    headers,
    httpMethod,
    path,
    resource,
    isBase64Encoded: false,
    stageVariables: {},
    pathParameters: null,
    queryStringParameters: null,
    requestContext: requestContext,
  };
  return event;
}

export function makeLambdaContext(args: Partial<LambdaContext> = {}): LambdaContext {
  return {
    functionName: '', 
    awsRequestId: '',
    callbackWaitsForEmptyEventLoop: false,

    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: 100,
    logGroupName: '',
    logStreamName: '',
    // identity?: CognitoIdentity;
    // clientContext?: ClientContext;

    // Functions
    getRemainingTimeInMillis(): number { return 0; },

    done(error?: Error, result?: any): void {},
    fail(error: Error | string): void {},
    succeed(messageOrObject: any): void {},
    // succeed(message: string, object: any): void {}
    ...args
  };
}
