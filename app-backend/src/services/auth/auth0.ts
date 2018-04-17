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
  scopes: string[];
}

export async function authenticate(event: CustomAuthorizerEvent): Promise<Auth0AuthenticationResult> {
  const token: string = getToken(event);

  const client = JwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: parseInt(process.env.JWKS_REQUESTS_PER_MINUTE, 10) || 10, // Default value
      jwksUri: process.env.JWKS_URI
  });

  var decodedJwt = < { header: { kid: string} }> jwt.decode(token, { complete: true });
  var kid = decodedJwt.header.kid; // key id
  const key = await client.getSigningKeyAsync(kid);
  const signingKey = key.publicKey || key.rsaPublicKey;
  const verified = <{ sub: string, scope: string }> await jwt.verifyAsync(
    token, signingKey,
    {
      audience: process.env.AUTH0_API_IDENTIFIER, // e.g., https://dev-precise.ly/graphql - not a real uri
      issuer: `https://${process.env.AUTH0_DOMAIN}/` // e.g., https://dev-precise.ly.auth0.com
    }
  );

  return {
    userId: verified.sub,
    scopes: verified.scope && verified.scope.split(' ')
  };
}
