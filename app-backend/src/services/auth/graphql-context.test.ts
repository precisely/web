import { GraphQLContext } from './graphql-context';
import context from 'jest-plugin-context';
import { APIGatewayEvent, APIGatewayEventRequestContext, Context as LambdaContext} from 'aws-lambda';
import { AuthResponseContext } from 'aws-lambda';
import { PreciselyRoles } from './roles';
import { compileScopes } from 'src/services/auth/scopes';

describe('GraphQLContext', function () {
  context('roles', function () {
    it('should be an array containing the comma-separated roles provided by the APIG event', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'admin,user'
      }}), makeLambdaContext());

      expect(gqlContext.roles).toEqual(['admin', 'user']);
    });
    it('should be an empty array if no roles are preset', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: null
      }}), makeLambdaContext());
      expect(gqlContext.roles).toEqual([]);
    });
  });

  context('userId', function () {
    it('should return the principalId provided in the authorizer', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        principalId: 'auth0|123'
      }}), makeLambdaContext());
      expect(gqlContext.userId).toEqual('auth0|123');
    });
  });

  context('scopes', function () {
    it('scopes should contain the combined scopes of the event roles', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'admin,user'
      }}), makeLambdaContext());
      expect(gqlContext.scopes).toEqual([
        ...PreciselyRoles.admin,
        ...PreciselyRoles.user
      ]);
    });
    it('scopes should contain no scopes if empty roles is provided', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: ''
      }}), makeLambdaContext());
      expect(gqlContext.scopes).toEqual([ ]);
    });

    it('scopes should contain no scopes if roles is missing', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        principalId: 'auth0|123',
      }}), makeLambdaContext());
      expect(gqlContext.scopes).toEqual([ ]);
    });
  });

  context('testScope', function () {
    it('should not throw an error if the provided scope is available', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'testRole'
      }}),
      makeLambdaContext(),
      {
        testRole: compileScopes('serviceX:read')
      });
      expect(gqlContext.testScope('serviceX:read')).toBeTruthy();
    });

    it('should throw an error if the provided scope is not available', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'testRole'
      }}),
      makeLambdaContext(),
      {
        testRole: compileScopes('serviceX:read')
      });
      expect(gqlContext.testScope('notAccessible:read')).toBeFalsy();
    });

    it('should not throw an error if the requested scope is matched with variable', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        principalId: 'auth0|123',
        roles: 'testRole'
      }}),
      makeLambdaContext(),
      {
        testRole: compileScopes('serviceX:read:$userId')
      });
      expect(gqlContext.testScope('serviceX:read:auth0|123')).toBeTruthy();
    });

    it('should throw an error if the requested scope refers to variable with a different value', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        principalId: 'auth0|123',
        roles: 'testRole'
      }}),
      makeLambdaContext(),
      {
        testRole: compileScopes('serviceX:read:$userId')
      });
      expect(gqlContext.testScope('serviceX:read:auth0|WRONG_USERID')).toBeFalsy();
    });
  });
});

function makeEvent({
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

function makeLambdaContext(): LambdaContext {
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

    // tslint:disable
    done(error?: Error, result?: any): void { },
    fail(error: Error | string): void {},
    succeed(messageOrObject: any): void {},
    // succeed(message: string, object: any): void {}
    // tslint:enable
  };
}
