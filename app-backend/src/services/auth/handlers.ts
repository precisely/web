import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import {policyDocument, publicPolicyDocument} from './policies';
import { log } from 'src/logger';

export const apiAuthorizer: CustomAuthorizerHandler = (
  event: CustomAuthorizerEvent,
  context: Context,
  callback: CustomAuthorizerCallback
) => makeUserPolicy(event, context)
      .then(result => callback(null, result))
      .catch(err => callback(err));

function offlineAuthentication(event: CustomAuthorizerEvent): Auth0AuthenticationResult {
  return {
    userId: 'auth0|0001',
    email: 'aneil@precise.ly'
  };
}

async function makeUserPolicy(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  log.info(`apiAuthorizer event:${JSON.stringify(event)}`);
  // auth0 returns userId and scopes
  const auth: Auth0AuthenticationResult = process.env.STAGE === 'offline' ?
  offlineAuthentication(event) :
  await authenticate(event);
  log.debug('apiAuthorizer authentication result: %j', auth);

  if (auth) {
    const authUserPolicy: CustomAuthorizerResult = {
      principalId: auth.userId,
      policyDocument: policyDocument(auth.userId, auth.admin),
      context: auth // this makes
                    //   $context.authorizer.userId, and
                    //   $context.authorizer.scopes
                    // available in cloud formation
    };
    log.debug('makeUserPolicy => (authenticated user) %j', authUserPolicy);
    return authUserPolicy;
  } else {
    const publicPolicy: CustomAuthorizerResult = {
      principalId: null,
      policyDocument: publicPolicyDocument()
    };
    log.debug('makeUserPolicy => (anonymous user) %j', publicPolicy);
    return publicPolicy;

  }
}
