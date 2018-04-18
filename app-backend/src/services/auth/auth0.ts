// Adapted from https://github.com/auth0/node-jwks-rsa

import * as JwksRsa from 'jwks-rsa-promisified';
import * as jwt from 'jsonwebtoken-promisified';
import { CustomAuthorizerEvent } from 'aws-lambda';

// extract and return the Bearer Token from the Lambda event parameters
function getToken(event: CustomAuthorizerEvent): string {

    if (!event.type || event.type !== 'TOKEN') {
        throw new Error(`Expected event.type parameter to have value TOKEN`);
    }

    const tokenString = event.authorizationToken;
    if (!tokenString) {
        throw new Error(`Expected event.authorizationToken parameter to be set`);
    }

    var match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - '${tokenString}' does not match 'Bearer .*'`);
    }
    return match[1];
}

export interface Auth0AuthenticationResult {
  userId: string;
  email?: string;
  admin?: boolean;
}

export async function authenticate(event: CustomAuthorizerEvent): Promise<Auth0AuthenticationResult> {
  await require('serverless-secrets/client').load();

  // ADMIN_EMAILS is set via yarn sls secrets:set -n /{stage}/adminEmails -t "alice@domain.com,bob@domain.com"
  const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(',');
  const AUTH0_TENANT_NAME = process.env.AUTH0_TENANT_NAME;
  const AUTH0_DOMAIN = `${AUTH0_TENANT_NAME}.auth0.com`;
  const AUTH0_JWKS_URI = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
  const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;
  const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;
  const AUTH0_JWKS_REQUESTS_PER_MINUTE = parseInt(process.env.JWKS_REQUESTS_PER_MINUTE, 10) || 10;

  const token: string = getToken(event);

  const client = JwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: AUTH0_JWKS_REQUESTS_PER_MINUTE,
      jwksUri: AUTH0_JWKS_URI
  });

  var decodedJwt = < { header: { kid: string} }> jwt.decode(token, { complete: true });
  var kid = decodedJwt.header.kid; // key id
  const key = await client.getSigningKeyAsync(kid);
  const signingKey = key.publicKey || key.rsaPublicKey;
  const verified = <{ sub: string, email: string }> await jwt.verifyAsync(
    token, signingKey,
    {
      audience: AUTH0_API_IDENTIFIER, // e.g., something like https://{stage}-precise.ly/graphql (not a real uri)
      issuer:  AUTH0_ISSUER // e.g., something like https://{stage}-precise.ly.auth0.com
    }
  );

  return {
    userId: verified.sub,
    email: verified.email,
    admin: ADMIN_EMAILS.indexOf(verified.email) !== -1
  };
}
