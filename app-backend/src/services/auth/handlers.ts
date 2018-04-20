import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import {policyDocument, publicPolicyDocument} from './policies';
import { log } from 'src/logger';

function offlineAuthentication(event: CustomAuthorizerEvent): Auth0AuthenticationResult {
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
  log.info(`apiAuthorizer event:${JSON.stringify(event)}`);
  // auth0 returns userId and scopes
  try {
    const auth: Auth0AuthenticationResult = process.env.STAGE === 'offline' ?
    offlineAuthentication(event) :
    await authenticate(event);
    log.debug(`apiAuthorizer authentication result: ${JSON.stringify(auth)}`);

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
      callback(null, {
        principalId: null,
        policyDocument: publicPolicyDocument()
      });
    }
  } catch (e) {
    callback(e);
  }
};
