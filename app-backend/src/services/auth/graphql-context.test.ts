import { GraphQLContext } from './graphql-context';
import context from 'jest-plugin-context';
import { APIGatewayEvent, APIGatewayEventRequestContext, Context as LambdaContext} from 'aws-lambda';
import { AuthResponseContext } from 'aws-lambda';
import { RBACPlus } from 'rbac-plus';

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

  context('can', function () {
    it('should return the expected permissions defined in an RBACPlus instance', async function () {
      const rbac = new RBACPlus();
      rbac.grant('user').scope('report:read');
      const event = makeEvent({ authorizer: { roles: 'user' }});
      const lambdaCtx = makeLambdaContext();
      const gqlContext = new GraphQLContext(event, lambdaCtx, rbac);
      const reportReadPermission = await gqlContext.can('report:read');
      expect(reportReadPermission.granted).toBeTruthy();

      const reportWritePermission = await gqlContext.can('report:write');
      expect(reportWritePermission.granted).toBeFalsy();
      expect(reportWritePermission.denied).toEqual([]);
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
