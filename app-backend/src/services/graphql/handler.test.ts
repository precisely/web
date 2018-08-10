/**
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {apiHandler, playgroundHandler, playgroundTitle} from './handlers';
import { makeLambdaContext, makeEvent, makeContext } from 'src/services/graphql/test-helpers';

describe('graphql handlers', function () {
  describe('playgroundTitle', function () {
    it('should include the stage in non-prod mode', function () {
      expect(playgroundTitle('foo')).toMatch('foo:Precise.ly GraphQL Playground');
    });

    it('should not include stage in prod', function () {
      expect(playgroundTitle('prod')).toMatch('Precise.ly GraphQL Playground');
    });
  });

  describe('apiHandler', function () {
    it('should be a function', () => {
      expect(typeof apiHandler).toBe('function');
    });

    it('should callback with an error result if the query is empty', (done) => {
      apiHandler(
        makeEvent({ authorizer: { principalId: 'userId', roles: 'user' }, body: '{ "query": "" }'}),
        makeLambdaContext({ awsRequestId: 'request-id'}),
        (error, result) => {
          expect(error).toBeFalsy();
          expect(result).toBeDefined();
          let parsedResult;
          expect(() => parsedResult = JSON.parse(result.body)).not.toThrow();
          expect(parsedResult).toMatchObject({
            errors: [{ message: /.*EOF.*/}]
          });
          done();
        }
      );
    });

    it('should callback with a valid result when provided a query ', (done) => {
      apiHandler(
        makeEvent({ authorizer: { principalId: 'userId', roles: 'user' }, 
                    body: '{ "query": "{ __schema { types { name } } }" }'}),
        makeLambdaContext({ awsRequestId: 'request-id'}),
        (error, result) => {
          expect(error).toBeFalsy();
          expect(result).toBeDefined();
          let parsedResult = JSON.parse(result.body);
          expect(parsedResult.errors).toBeUndefined();
          expect(parsedResult.data).toBeDefined();
          expect(parsedResult.data.__schema).toBeDefined();
          expect(parsedResult.data.__schema.types).toBeDefined();
          done();
        }
      );
    });
  });

  it('playgroundHandler should be a function', () => {
    expect(typeof playgroundHandler).toBe('function');
  });
});
