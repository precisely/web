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

    it('should call the graphqlLambda function', (done) => {
      apiHandler(
        makeEvent({ authorizer: { principalId: 'userId', roles: 'user' }}),
        makeLambdaContext({ awsRequestId: 'request-id'}),
        (error, result) => {
          done();
        }
      );
    });
  });

  it('playgroundHandler should be a function', () => {
    expect(typeof playgroundHandler).toBe('function');
  });
});
