/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
// tslint:disable:no-any
// tslint:disable:forin

import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { Auth0AuthenticationResult } from 'src/services/auth/auth0';
import _accessControl from 'src/services/auth/access-control';
import { AccessControlPlus, IPermission, IContext } from 'accesscontrol-plus';
import { TypedError } from 'src/common/errors';
import { Item } from 'src/db/dynamo/dynogels';
import { get as dig } from 'lodash';
import { IResolverObject } from 'graphql-tools';
import { isArray, isString } from 'util';

export {_accessControl as accessControl};

// This is the third argument to every GraphQL resolver
export class GraphQLContext {
  constructor(
    public readonly event: APIGatewayEvent,
    public readonly lambdaContext: LambdaContext,
    public readonly accessControl: AccessControlPlus = _accessControl) {
  }
  
  private logger: Logger;

  get log() {
    if (!this.logger) {
      this.logger = makeLogger(this.lambdaContext.awsRequestId);
    }
    return this.logger;
  }

  /**
   * Always returns a Permission representing whether the resource can be accessed
   * 
   * @param scope 
   * @param resource 
   */
  async can<M>(scope: string, resource?: M, args: IContext = {}): Promise<IPermission> {
    this.log.debug('GraphQLContext.can(scope: %j, args: %j)', 
      scope, args);
    const context = {
      event: this.event,
      user: {
        id: this.userId,
        roles: this.roles 
      },
      args,
      resource: resource
    };
    const permission = await this.accessControl.can(this.roles, scope, context);
    this.log.silly('GraphQLContext accessControl.can(roles: %j, scope: %j, context: %j) => %j', 
      this.roles, scope, context, permission
    ); 
    return permission;
  }

  /**
   * Returns access-control validated resource(s) or throws access control error,
   * or if the resources is an array, replaces the
   *
   * @template M
   * @param {string} scope
   * @param {(M | (M[]))} res - resource or resources
   * @returns {(Promise<M | (M | Error)[]>)}
   * @memberof GraphQLContext
   */
  async valid<M>(
    scope: string, 
    res: M[] | M, 
    args: IContext = {}
  ): Promise<M | (Error | M)[] > {
    if (isArray(res)) {
      const resources = res;
      const validResources = await Promise.all(resources.map(async resource => {
        const permission = await this.can(scope, resource, args);
        return  permission.granted ? resource : new TypedError(scope, 'accessDenied');
      }));
      return validResources;
    } else {
      const permission = await this.can(scope, res, args);
      if (permission.granted) {
        return res;
      }
      this.log.debug('Permission denied: %j', permission.denied || 'undefined');
    }
    
    throw new TypedError(scope, 'accessDenied');
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
    return dig(this, 'event.requestContext.authorizer.principalId'); // the auth0 userId "auth0|a6b34ff91"
  }

  /**
   * Generates a GraphQL resolver for the given attributes of a DynamoDB model
   *   The resolver methods check that access is permitted and return the value of the field
   *
   * @static
   * @param {string} resource
   * @param {string[]} attrs
   * @returns {IResolverObject}
   * @memberof GraphQLContext
   */
  public static dynamoAttributeResolver<T>(
    resource: string,
    attrs: Extract<keyof T, string>[] | { [key: string]: Extract<keyof T, string> }
  ): IResolverObject {
    return this.propertyResolver(
      resource, attrs,
      (mappedKey: Extract<keyof T, string>) => (obj: Item<T>) => obj.get(mappedKey));
  }

  /**
   * Generates a GraphQL resolver for the given properties of an object
   *   The resolver methods check that access is permitted and return the value of the property
   *
   * E.g., GraphQLContext.propertyResolver('mymodel', [
   *   'field1', 'field2'
   * ])
   * or
   * GraphQLContext.propertyResolver('mymodel', {
   *   gqlField1: 'modelProp1', gqlField2: 'modelProp2'
   * })
   * or
   * GraphQLContext.propertyResolver('mymodel', {
   *   gqlField1: 'modelProp1', gqlField2: (obj: MyModel) => obj.get('field2')
   * })
   *
   * @static
   * @param {string} resource
   * @param {string[]} props
   * @memberof GraphQLContext
   */
  public static propertyResolver(
    resource: string,
    props: PropertyMapArg,
    accessGenerator?: PropertyAccessorGenerator
  ): IResolverObject {
    let resolver: IResolverObject = {};
    accessGenerator = accessGenerator || ((key: string) => ((obj: any) => obj[key]));
    const normMap: NormalizedPropertyMap = normalizePropertyMap(props, accessGenerator);
    for (const prop in normMap) {
      const scope = `${resource}:read:${prop}`;
      const accessor = normMap[prop];
      resolver[<string> prop] = async (obj: any, args: IContext, context: GraphQLContext) => {
        if (await context.valid(scope, obj, args)) {
          return await accessor(obj, args, context);
        }
      };
    }
    return resolver;
  }
}

type PropertyAccessor = (obj: any, args?: IContext, context?: GraphQLContext) => any;
type PropertyMapArg = string[] | { [key: string]: PropertyAccessor | string };
type NormalizedPropertyMap = { [key: string]: PropertyAccessor };
type PropertyAccessorGenerator = (value: string) => PropertyAccessor;
import {fromPairs, zip, mapValues} from 'lodash';
import { makeLogger, Logger } from 'src/common/logger';

export function normalizePropertyMap(
  inMap: PropertyMapArg,
  accessGenerator: PropertyAccessorGenerator): NormalizedPropertyMap {
  if (isArray(inMap)) {
    return fromPairs(zip(inMap, inMap.map(accessGenerator)));
  } else {
    return mapValues(inMap, (value: PropertyAccessor | string) => {
      return isString(value) ? accessGenerator(value) : value;
    });
  }
}
