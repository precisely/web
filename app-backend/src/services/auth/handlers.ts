import {
  CustomAuthorizerHandler, CustomAuthorizerEvent,
  CustomAuthorizerCallback, CustomAuthorizerResult,
  Context
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import {userPolicyDocument} from './policies';

export const userAuthorizer: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
  context: Context,
  callback: CustomAuthorizerCallback
) => {
  // auth0 returns userId and scopes
  const auth: Auth0AuthenticationResult = await authenticate(event);

  if (auth) {
    const result: CustomAuthorizerResult = {
      principalId: auth.userId,
      policyDocument: userPolicyDocument(auth.userId),
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
