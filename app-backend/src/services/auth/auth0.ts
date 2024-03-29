/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
// Adapted from https://github.com/auth0/node-jwks-rsa

import * as JwksRsa from 'jwks-rsa-promisified';
import * as jwt from 'jsonwebtoken-promisified';
import { CustomAuthorizerEvent } from 'aws-lambda';
import { Logger } from 'src/common/logger';

// extract and return the Bearer Token from the Lambda event parameters
export function getToken(event: CustomAuthorizerEvent): string {
  if (!event.type || event.type !== 'REQUEST') {
    throw new Error(`Expected event.type parameter to have value REQUEST`);
  }

  const tokenString = event.headers && (event.headers.Authorization || event.headers.authorization);
  if (!tokenString) {
    throw new Error('Missing Authorization header');
  }

  const match = tokenString.match(/^Bearer (.*)$/i);
  if (!match || match.length < 2) {
    throw new Error(`Invalid Authorization token - '${tokenString.substr(0, 50)}...' does not match 'Bearer .*'`);
  }
  return match[1];
}

export interface Auth0AuthenticationResult {
  principalId: string;
  email?: string;
  roles?: string;
}

export async function authenticate(event: CustomAuthorizerEvent, log: Logger): Promise<Auth0AuthenticationResult> {
  try {
    const AUTH0_TENANT_NAME = process.env.AUTH0_TENANT_NAME;
    const AUTH0_DOMAIN = `${AUTH0_TENANT_NAME}.auth0.com`;
    const AUTH0_JWKS_URI = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
    const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;
    // Uncomment when we fix the issue below
    // const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;
    const AUTH0_JWKS_REQUESTS_PER_MINUTE = parseInt(process.env.JWKS_REQUESTS_PER_MINUTE || '10', 10) || 10;

    const token: string = getToken(event);
    const client = JwksRsa({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: AUTH0_JWKS_REQUESTS_PER_MINUTE,
        jwksUri: AUTH0_JWKS_URI
    });

    const decodedJwt = < { header: { kid: string} }> jwt.decode(token, { complete: true });
    const kid = decodedJwt.header.kid; // key id
    const key = await client.getSigningKeyAsync(kid);
    log.silly('auth0.authenticate decodedJWT=%j signingKey %j', decodedJwt, key);

    const signingKey = key.publicKey || key.rsaPublicKey || '';
    const verified = <{ sub: string, email: string }> await jwt.verifyAsync(
      token, signingKey,
      {
        // TODO: Fix the audience - currently, audience returned is the auth0 Precisely ReactClient identifier,
        // not what we want it to be (the AUTH0_API_IDENTIFIER)
        // audience: AUTH0_API_IDENTIFIER, 
        issuer:  AUTH0_ISSUER // e.g., something like https://{stage}-precise.ly.auth0.com
      }
    );
    log.info('auth0.authenticate verified token: %j', verified);
    
    return {
      principalId: auth0SubToUserId(verified.sub),
      email: verified.email,
      roles: verified['https://precise.ly/roles']
    };
  } catch (e) {
    log.silly('Failed to authenticate: %s', e);
    return {
      principalId: 'public',
      roles: 'public'
    };
  }
}

function auth0SubToUserId(sub: string) {
  return sub.replace('|', '-');
}
