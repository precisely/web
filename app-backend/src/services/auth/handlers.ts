/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import {
  CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult,
  Context, PolicyDocument
} from 'aws-lambda';
import { authenticate, Auth0AuthenticationResult } from './auth0';
import {makeLogger} from 'src/common/logger';
import {isOffline} from 'src/common/environment';

export const apiAuthorizer: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent, context: Context) => {
  const log = makeLogger(context.awsRequestId);
  try {
    return await makeUserPolicy(event, context);
  } catch (e) {
    log.info('apiAuthorizer: %s', e);
    throw e;
  }
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
      `arn:aws:execute-api:${process.env.REGION}:${process.env.ACCOUNT_ID}:*/*/POST/${process.env.GRAPHQL_API_PATH}`,
      `arn:aws:execute-api:${process.env.REGION}:${process.env.ACCOUNT_ID}:*/*/GET/${process.env.BIOINFORMATICS_UPLOAD_SIGNED_URL_PATH}`
    ]
  }]
};

async function makeUserPolicy(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  const log = makeLogger(context.awsRequestId);
  log.silly('APIAuthorizer event: %j', event);
  // auth0 returns userId and scopes
  const auth: Auth0AuthenticationResult = await authenticate(event, log);
  
  const authUserPolicy: CustomAuthorizerResult = {
    principalId: auth.principalId,
    policyDocument: InvokeAPIPolicyDocument,
    context: auth // this makes
                  //   $context.authorizer.principalId, and
                  //   $context.authorizer.roles
                  // available in cloud formation
  };
  log.switch({
    silly: ['APIAuthorizer returns policy: %j', authUserPolicy],
    info: ['APIAuthorizer allow %j', auth]
  });

  return authUserPolicy;
}
