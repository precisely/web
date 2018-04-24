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
      .then(result => {
        callback(null, result);
      })
      .catch(err => {
        log.info('apiAuthorizer: %s', err);
        callback(err);
      });

function offlineAuthentication(event: CustomAuthorizerEvent): Auth0AuthenticationResult {
  return {
    userId: 'auth0|0001',
    email: 'aneil@precise.ly'
  };
}

async function makeUserPolicy(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  log.info('ApiAuthorizer event: %j', JSON.stringify(event));
  // auth0 returns userId and scopes
  try {
    const auth: Auth0AuthenticationResult = (process.env.STAGE === 'offline' ?
      offlineAuthentication(event) :
      await authenticate(event)
    );
    const authUserPolicy: CustomAuthorizerResult = {
      principalId: auth.userId,
      policyDocument: policyDocument(auth.userId, auth.admin),
      context: auth // this makes
                    //   $context.authorizer.userId, and
                    //   $context.authorizer.scopes
                    // available in cloud formation
    };
    log.debug('ApiAuthorizer => (authenticated user policy) %j', authUserPolicy);
    return authUserPolicy;
  } catch (e) {
    const publicPolicy: CustomAuthorizerResult = {
      principalId: 'public',
      policyDocument: publicPolicyDocument()
    };
    log.debug('ApiAuthorizer => (anonymous user policy) %j', publicPolicy);
    return publicPolicy;
  }
}
