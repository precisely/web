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

  if (!event.headers || !event.headers.Authorization) {
    throw new Error('Missing Authorization header');
  }

  const tokenString: string = event.headers.Authorization;

  var match = tokenString.match(/^Bearer (.*)$/i);
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
    const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    const AUTH0_TENANT_NAME = process.env.AUTH0_TENANT_NAME;
    const AUTH0_DOMAIN = `${AUTH0_TENANT_NAME}.auth0.com`;
    const AUTH0_JWKS_URI = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
    const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;
    const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;
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
        audience: AUTH0_API_IDENTIFIER, // e.g., something like https://{stage}-precise.ly/graphql (not a real uri)
        issuer:  AUTH0_ISSUER // e.g., something like https://{stage}-precise.ly.auth0.com
      }
    );

    return {
      principalId: verified.sub,
      email: verified.email,
      roles: ADMIN_EMAILS.indexOf(verified.email) !== -1 ? 'admin,user' : 'user'
    };
  } catch (e) {
    return {
      principalId: 'public',
      roles: 'public'
    };
  }
}
