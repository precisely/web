/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('aws-sdk');

const unroll = require('unroll');
unroll.use(it);

import * as AWS from 'aws-sdk';
import {getEnvironmentVariables, addEnvironmentToTableName, hasAuthorizedRoles} from '../../utils';
import {Authorizer} from '../../interfaces';

describe('Test for getEnvironmentVariables', function() {

  process.env.SECRETS = 'test';

  it('getEnvironmentVariables should be a function', function() {
    expect(typeof getEnvironmentVariables).toBe('function');
  });

  it('should return null when error', async () => {
    // @ts-ignore
    AWS.mockedDecrypt.mockImplementationOnce(() => { throw new Error('mock error'); });
    const result = await getEnvironmentVariables();
    expect(result).toBeFalsy();
  });

  it('should return data when successful', async () => {
    const result = await getEnvironmentVariables();
    expect(result).toEqual({'demo': 'test'});
  });

});

describe('Test for addEnvironmentToTableName', function() {
  process.env.NODE_ENV = 'dev';

  it('should add the environment to the table name.', function() {
    const result: string = addEnvironmentToTableName('test-table', '01');
    expect(result).toBe('dev-01-test-table');
  });
});

describe('Tests for hasAuthorizedRoles', function() {
  unroll('it should throw an error when the authorizer is #authorizerValue', async function(
      done: () => void,
      args: {authorizerValue: Authorizer}
  ) {
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

  it('should return true when the current user is an admin.', function() {
    const result: boolean = hasAuthorizedRoles({claims: {'custom:roles': 'USER, ADMIN', sub: ''}}, ['ADMIN']);
    expect(result).toEqual(true);
  });
});
