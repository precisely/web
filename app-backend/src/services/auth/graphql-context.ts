import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { Auth0AuthenticationResult } from './auth0';
import _accessControl from './accessControl';
import { RBACPlus, IPermission } from 'rbac-plus';
import { TypedError } from 'src/common/errors';
import { Item } from 'src/db/dynamo/dynogels';

// This is the third argument to every GraphQL resolver
export class GraphQLContext {
  constructor(
    public readonly event: APIGatewayEvent,
    public readonly lambdaContext: LambdaContext,
    public readonly accessControl: RBACPlus = _accessControl) {
  }

  // tslint:disable-next-line
  async can<T>(scope: string, resource?: Item<T>): Promise<IPermission> {
    let permission: IPermission;
    for (const role of this.roles) {
      permission = await this.accessControl.can(role, scope, {
        event: this.event,
        user: {
          id: this.userId,
          roles: this.roles },
        resource: resource
      });
      if (permission.granted) {
        return permission;
      }
    }

    return permission || {};
  }

  /**
   * Roles assigned to the current user
   */
  get roles(): string[] {
    return this.auth.roles ? this.auth.roles.split(',') : [];
  }

  /**
   * The policy context generated by the custom authorizer
   */
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

type GraphQLTarget = any; // tslint:disable-line

/**
 * Scope decorator - useful when a scope
 * E.g.,
 * class FooResolver {
 *   @scoped('Foo:read') // user must have the 'foo:read' scope
 *   static read(foo: Foo) { return Foo.get('value'); }
 * }
 * export const resolvers = {
 *   Foo: FooResolver
 * };
 *
 * @export
 * @param {string} scope
 * @returns {Function} graphQL resolver function
 */
export function scoped(scope: string) {
  // tslint:disable-next-line
  return function (target: GraphQLTarget, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const methodName: string = method.name;
    // tslint:disable-next-line
    descriptor.value = async function (obj: GraphQLTarget, args: any, context: GraphQLContext, root: any) {
      let permission = await context.can(scope, obj);
      if (permission.granted) {
        return method.call(this, obj, args, context, root);
      } else {
        throw new TypedError(`Method ${methodName} not authorized for ${scope}`, 'accessDenied');
      }
    };
  };
}
