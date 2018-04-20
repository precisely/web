import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import { policyDocument } from './policies';
import { log } from 'src/logger';

function offlineAuthentication(event: CustomAuthorizerEvent): Auth0AuthenticationResult {
  log.info(`offlineAuthentication: ${JSON.stringify(event)}`);
  return {
    userId: 'auth0|0001',
    email: 'aneil@precise.ly'
  };
}

export const apiAuthorizer: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
  context: Context,
  callback: CustomAuthorizerCallback
) => {
  // auth0 returns userId and scopes
  const auth: Auth0AuthenticationResult = process.env.STAGE === 'offline' ?
   offlineAuthentication(event) :
   await authenticate(event);

  if (auth) {
    const result: CustomAuthorizerResult = {
      principalId: auth.userId,
      policyDocument: policyDocument(auth.userId, auth.admin),
      context: auth // this makes
                    //   $context.authorizer.userId, and
                    //   $context.authorizer.scopes
                    // available in cloud formation
    };

    callback(null, result);
  } else {
    callback(new Error('Unauthorized'));
  }
};
