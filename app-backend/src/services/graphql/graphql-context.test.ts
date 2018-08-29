/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
// tslint:disable:no-any
// tslint:disable:no-empty

import context from 'jest-plugin-context';
import { AccessControlPlus, IContext } from 'accesscontrol-plus';
import { defineModel } from 'src/db/dynamo/dynogels';
import { GraphQLContext } from './graphql-context';
import { makeEvent, makeLambdaContext } from './test-helpers';

describe('GraphQLContext', function () {
  context('roles', function () {
    it('should be an array containing the comma-separated roles provided by the APIG event', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'admin,user'
      }}), makeLambdaContext());

      expect(gqlContext.roles).toEqual(['admin', 'user']);
    });
    it('should be an empty array if no roles are preset', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: null
      }}), makeLambdaContext());
      expect(gqlContext.roles).toEqual([]);
    });
  });

  context('userId', function () {
    it('should return the principalId provided in the authorizer', function () {
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        principalId: 'auth0|123'
      }}), makeLambdaContext());
      expect(gqlContext.userId).toEqual('auth0|123');
    });
  });

  context('accessControl', function () {
    const rbac = new AccessControlPlus();
    const event = makeEvent({ authorizer: { principalId: 'user-id-123', roles: 'user' }});
    const lambdaCtx = makeLambdaContext();
    const gqlContext = new GraphQLContext(event, lambdaCtx, rbac);

    context('can', function () {
      it('should return the expected permissions defined in an AccessControlPlus instance', async function () {
        rbac.grant('user').scope('report:read');

        const reportReadPermission = await gqlContext.can('report:read');
        expect(reportReadPermission.granted).toBeTruthy();

        const reportWritePermission = await gqlContext.can('report:write');
        expect(reportWritePermission.granted).toBeFalsy();
        expect(reportWritePermission.denied).toEqual([]);
      });

      it('should add a valid user object to the context provided to an attribute condition', async function () {
        let capturedUser;
        const constraint = ({user}: any) => capturedUser = user;

        rbac.grant('user').scope('report:read').where(constraint);

        const reportReadPermission = await gqlContext.can('report:read');
        expect(reportReadPermission.granted).toBeTruthy();

        const reportWritePermission = await gqlContext.can('report:write');
        expect(reportWritePermission.granted).toBeFalsy();
        expect(reportWritePermission.denied).toEqual([]);
      });
    });

    context('valid', function () {
      it('should return the resource if permission is provided', async function () {
        rbac.grant('user').scope('report:read').where();
        const report = { type: 'report' };
        expect(await gqlContext.valid('report:read', report)).toEqual(report);
      });

      it('should throw an error if permission is denied', async function () {
        rbac.grant('user').scope('report:read').where();
        const report = { type: 'report' };
        const promise = gqlContext.valid('report:restricted-action', report);
        return expect(promise).rejects.toBeInstanceOf(Error);
      });

      it('should return an array with resources or errors depending on permission grant', async function () {
        function resourceValid({resource}: IContext) { return resource.valid; }
        rbac.grant('user').scope('report:read-valid').where(resourceValid);

        const validResource = { valid: true };
        const invalidResource = { valid: false };
        const resources = await gqlContext.valid('report:read-valid', [
          validResource, invalidResource, invalidResource, validResource
        ]);
        expect(resources[0]).toEqual(validResource);
        expect(resources[1]).toBeInstanceOf(Error);
        expect(resources[2]).toBeInstanceOf(Error);
        expect(resources[3]).toEqual(validResource);
      });

    });
  });

  context('propertyResolver', function () {

    it('should return resolvers for each of the provided fields', function () {
      const resolver = GraphQLContext.propertyResolver('mymodel', ['foo', 'bar']);
      expect(resolver.foo).toBeInstanceOf(Function);
      expect(resolver.bar).toBeInstanceOf(Function);
    });

    it('should provide a fn which resolves a permitted attribute (foo) of the root object', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user'
      }}), makeLambdaContext(),
      rbac);

      rbac.grant('user').scope('mymodel:read').onFields('foo', '!bar');
      const resolver = GraphQLContext.propertyResolver('mymodel', ['foo', 'bar']);

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = { foo: 'foo value', bar: 'bar value' };
      const fooResult = (<ResolverFn> resolver.foo)(mymodel, null, gqlContext);
      return expect(fooResult).resolves.toBe('foo value');
    });

    it('should provide a fn which rejects a disallowed attribute (bar) of the root object', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user'
      }}), makeLambdaContext(),
      rbac);
      rbac.grant('user').scope('mymodel:read').onFields('foo', '!bar'); // disallow bar!

      const resolver = GraphQLContext.propertyResolver('mymodel', ['foo', 'bar']);

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = { foo: 'foo value', bar: 'bar value' };

      const barResult = (<ResolverFn> resolver.bar)(mymodel, null, gqlContext);
      return expect(barResult).rejects.toBeInstanceOf(Error);
    });

    it('should provide a fn which resolves to alternate properties', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user'
      }}), makeLambdaContext(),
      rbac);

      rbac.grant('user').scope('mymodel:read').onFields('foo', '!bar');
      const resolver = GraphQLContext.propertyResolver('mymodel', {
        foo: 'internalFoo',
        bar: 'internalBar'
      });

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = { internalFoo: 'foo value', internalBar: 'bar value' };
      const fooResult = (<ResolverFn> resolver.foo)(mymodel, null, gqlContext);
      return expect(fooResult).resolves.toBe('foo value');
    });

    it('should accept function for property resolver which takes context', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user',
        principalId: 'bob'
      }}), makeLambdaContext(),
      rbac);

      rbac.grant('user').scope('mymodel:read').onFields('foo').where(({user, args}: any) => {
        return user.id === args.requestedUserId;
      });
      const resolver = GraphQLContext.propertyResolver('mymodel', {
        foo(obj: any) { 
          return obj.internalFoo; 
        }
      });

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = { internalFoo: 'foo value', internalBar: 'bar value' };
      const resolverArgs = { requestedUserId: 'bob' };

      const fooResult = await (<ResolverFn> resolver.foo)(mymodel, resolverArgs, gqlContext);
      expect(fooResult).toBe('foo value');
    });
  });

  context('dynamoAttributeResolver', function () {
    interface MyModelAttributes {
      foo?: string;
      bar?: string;
    }
    process.env.STAGE = process.env.STAGE || 'test';
    const MyModel = defineModel<MyModelAttributes>('mymodel', {
      hashKey: 'foo',
      rangeKey: 'bar'
    });

    it('should return resolvers for each of the provided fields', function () {
      const resolver = GraphQLContext.dynamoAttributeResolver<MyModelAttributes>('mymodel', ['foo', 'bar']);
      expect(resolver.foo).toBeInstanceOf(Function);
      expect(resolver.bar).toBeInstanceOf(Function);
    });

    it('should provide a fn which resolves a permitted attribute (foo) of the root object', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user'
      }}), makeLambdaContext(),
      rbac);

      rbac.grant('user').scope('mymodel:read').onFields('foo', '!bar');
      const resolver = GraphQLContext.dynamoAttributeResolver<MyModelAttributes>('mymodel', ['foo', 'bar']);

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = new MyModel({ foo: 'foo value', bar: 'bar value' });
      const fooResult = (<ResolverFn> resolver.foo)(mymodel, null, gqlContext);
      return expect(fooResult).resolves.toBe('foo value');
    });

    it('should provide a fn which rejects a disallowed attribute (bar) of the root object', async function () {
      const rbac = new AccessControlPlus();
      const gqlContext = new GraphQLContext(makeEvent({ authorizer: {
        roles: 'user'
      }}), makeLambdaContext(),
      rbac);
      rbac.grant('user').scope('mymodel:read').onFields('foo', '!bar'); // disallow bar!

      const resolver = GraphQLContext.dynamoAttributeResolver<MyModelAttributes>('mymodel', ['foo', 'bar']);

      type ResolverFn = (root: any, args: any, context: GraphQLContext) => Promise<any>;
      const mymodel = new MyModel({ foo: 'foo value', bar: 'bar value' });

      const barResult = (<ResolverFn> resolver.bar)(mymodel, null, gqlContext);
      return expect(barResult).rejects.toBeInstanceOf(Error);
    });
  });
});
