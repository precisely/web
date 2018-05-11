import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { IResolverObject } from 'graphql-tools';
import {Item} from 'src/db/dynamo/dynogels';
import { Auth0AuthenticationResult } from 'src/services/auth/auth0';
import { RoleScopes } from 'src/services/auth/roles';
import { checkScope } from 'src/services/auth/scopes';

// This is the third argument to every GraphQL resolver
export class GraphQLContext {

  constructor(public readonly event: APIGatewayEvent, public readonly lambdaContext: LambdaContext) {
  }

  checkScope(requestedScopeSymbol: string): void {
    const providedScopes = this.scopes;
    checkScope(requestedScopeSymbol, providedScopes, {
      auth: this.auth,
      event: this.event,
      request: this.lambdaContext
    });
  }

  get scopes(): string[][] {
    return this.auth.roles.reduce((scopes: string[], role) => [...scopes, RoleScopes[role]], []);
  }

  get auth(): Auth0AuthenticationResult {
    return <Auth0AuthenticationResult> this.event.requestContext.authorizer;
  }

  get userId(): string {
    return this.event.requestContext.authorizer.principalId; // the auth0 userId "auth0|a6b34ff91"
  }
}

export function dynamoFieldResolver<T>(fields: (keyof T)[]): IResolverObject {
  let resolver = {};
  for (const field of fields) {
    resolver[<string> field] = (obj: Item<T>) => obj.get(field);
  }
  return resolver;
}
