/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('aws-sdk', () => {
  return {
    KMS: () => ({
      decrypt: jest.fn()
        .mockImplementationOnce((
            params: AWS.KMS.Types.DecryptRequest,
            callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
        ) => {
          callback(new Error('mock error'), null);
        })
        .mockImplementationOnce((
            params: AWS.KMS.Types.DecryptRequest,
            callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
        ) => {
          callback(null, {Plaintext: new Buffer(JSON.stringify({demo: 'test'}))});
        })
    })
  };
});

import {getEnvironmentVariables, addEnvironmentToTableName, hasAuthorizedRoles} from '../utils';
import {AuthorizerAttributes} from '../interfaces';

const unroll = require('unroll');
unroll.use(it);

describe('Test for getEnvironmentVariables', () => {

  process.env.SECRETS = 'test';

  it('getEnvironmentVariables should be a function', () => {
    expect(typeof getEnvironmentVariables).toBe('function');
  });

  unroll('it should #description when #expectedResult', async (
      done: () => void,
      args: {expectedResult: string, description: string}
  ) => {
    const result = await getEnvironmentVariables();
    if (args.expectedResult === 'pass') {
      expect(result).toEqual({'demo': 'test'});
    } else {
      expect(result).toBeFalsy();
    }
    done();
  }, [
    ['expectedResult', 'description'],
    ['fail', 'return null'],
    ['pass', 'return data'],
  ]);
});

describe('Test for addEnvironmentToTableName', () => {
  process.env.NODE_ENV = 'dev';

  it('should add the environment to the table name.', () => {
    const result: string = addEnvironmentToTableName('test-table', '01');
    expect(result).toBe('dev-01-test-table');
  });
});

describe('Tests for hasAuthorizedRoles', () => {
  unroll('it should throw an error when the authorizer is #authorizerValue', async (
      done: () => void,
      args: {authorizerValue: AuthorizerAttributes}
  ) => {
    expect(() => hasAuthorizedRoles(args.authorizerValue, ['ADMIN'])).toThrowError('The user is unauthorized.');
    done();
  }, [
    ['authorizerValue'],
    [''],
    [{claims: ''}],
    [{claims: {}}],
    [{claims: {'custom:roles': ''}}],
    [{claims: {'custom:roles': 'USER'}}],
  ]);

  it('should return true when the current user is an admin.', () => {
    const result: boolean = hasAuthorizedRoles({claims: {'custom:roles': 'USER, ADMIN', sub: ''}}, ['ADMIN']);
    expect(result).toEqual(true);
  });
});
