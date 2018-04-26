import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import {policyDocument, publicPolicyDocument } from './policies';
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
    userId: 'auth0|0001',
    email: 'aneil@precise.ly'
  };
}

async function makeUserPolicy(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  log.info('APIAuthorizer event: %j typeof=%s', event, typeof event);
  // auth0 returns userId and scopes
  try {
    const auth: Auth0AuthenticationResult = (process.env.STAGE === 'offline' ?
      offlineAuthentication(event) :
      await authenticate(event)
    );
    const authUserPolicy: CustomAuthorizerResult = {
      principalId: '*', // auth.userId,
      policyDocument: policyDocument(auth.userId, auth.admin),
      context: auth // this makes
                    //   $context.authorizer.userId, and
                    //   $context.authorizer.scopes
                    // available in cloud formation
    };
    log.debug('APIAuthorizer => (authenticated user policy) %j', authUserPolicy);
    return authUserPolicy;
  } catch (e) {
    log.silly('APIAuthorizer failed to authenticate: ', e);
    const publicPolicy: CustomAuthorizerResult = {
      principalId: '*',
      policyDocument: publicPolicyDocument()
    };
    log.debug('APIAuthorizer => (anonymous user policy) %j', publicPolicy);
    return publicPolicy;
    // log.error(e);
    // const openAccess = { principalId: '*', policyDocument: CrazyOpenAccessPolicyDocument};
    // log.debug('APIAuthorizer => crazy open-ended policy document', openAccess);
    // return openAccess;
  }
}
