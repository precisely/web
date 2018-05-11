import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { Auth0AuthenticationResult } from './auth0';
import { RoleScopes, PreciselyRoles } from './roles';
import { checkScope } from './scopes';

// This is the third argument to every GraphQL resolver
export class GraphQLContext {
  constructor(
    public readonly event: APIGatewayEvent,
    public readonly lambdaContext: LambdaContext,
    public roleScopes: RoleScopes = PreciselyRoles) {
  }

  checkScope(requestedScopeSymbol: string): void {
    const providedScopes = this.scopes;
    checkScope(requestedScopeSymbol, providedScopes, this);
  }

  get scopes(): string[][] {
    return this.roles.reduce((scopes: string[][], role) => [
      ...scopes,
      ...( this.roleScopes.hasOwnProperty(role) ? this.roleScopes[role] : [])
    ], []);
  }

  get roles(): string[] {
    return this.auth.roles ? this.auth.roles.split(',') : [];
  }

  get auth(): Auth0AuthenticationResult {
    return <Auth0AuthenticationResult> this.event.requestContext.authorizer;
  }

  /**
   * Shortcut for accessing the currently active user
   */
  get userId(): string {
    return this.event.requestContext.authorizer.principalId; // the auth0 userId "auth0|a6b34ff91"
  }
}
