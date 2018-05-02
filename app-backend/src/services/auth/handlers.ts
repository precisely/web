import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context,
  PolicyDocument
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import { log } from 'src/logger';

export const apiAuthorizer: CustomAuthorizerHandler = (
  event: CustomAuthorizerEvent,
  context: Context,
  callback: CustomAuthorizerCallback
): void => {
   makeUserPolicy(event, context)
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      log.info('apiAuthorizer: %s', err);
      callback(err);
    });
  };

function offlineAuthentication(event: CustomAuthorizerEvent): Auth0AuthenticationResult {
  return {
    principalId: 'auth0|0001',
    email: 'aneil@precise.ly'
  };
}

const InvokeAPIPolicyDocument: PolicyDocument = {
  Version: '2012-10-17',
  Statement: [{
    Effect: 'Allow',
    Action: 'execute-api:Invoke',
    Resource: [
      // tslint:disable-next-line
      `arn:aws:execute-api:${process.env.REGION}:${process.env.ACCOUNT_ID}:*/*/POST${process.env.GRAPHQL_API_PATH}`
    ]
  }]
};

async function makeUserPolicy(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  const requestId = event.requestContext.requestId;
  log.silly('APIAuthorizer event: %j [%s]', event, requestId);
  // auth0 returns userId and scopes
  const auth: Auth0AuthenticationResult = (process.env.STAGE === 'offline' ?
    offlineAuthentication(event) :
    await authenticate(event)
  );
  const authUserPolicy: CustomAuthorizerResult = {
    principalId: auth.principalId,
    policyDocument: InvokeAPIPolicyDocument,
    context: auth // this makes
                  //   $context.authorizer.principalId, and
                  //   $context.authorizer.role
                  // available in cloud formation
  };
  log.switch({
    silly: ['APIAuthorizer => (success) %j [%s]', authUserPolicy, requestId],
    info: ['APIAuthorizer authenticated principalId: %s [%s]', auth.principalId, requestId]
  });

  return authUserPolicy;
}
