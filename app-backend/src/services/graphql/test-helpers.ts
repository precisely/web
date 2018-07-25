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
  headers = { Authorization: 'Bearer abcd' }
}: {
  authorizer?: AuthResponseContext,
  headers?: { [name: string]: string }
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
    requestId: 'req123',
    requestTimeEpoch: 123123123,
    resourceId: 'resource123',
    resourcePath: '/api',

  };
  const event: APIGatewayEvent = {
    body: 'the body',
    headers,
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/api',
    stageVariables: {},
    pathParameters: null,
    queryStringParameters: null,
    requestContext: requestContext,
    resource: '/api'
  };
  return event;
}

export function makeLambdaContext(): LambdaContext {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: 100,
    awsRequestId: '',
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
  };
}
