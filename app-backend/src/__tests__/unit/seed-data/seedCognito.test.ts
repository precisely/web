/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {cognito, seedCognito} from '../../../seed-data/scripts/seedCognito';
import {mockCognitoUser} from './mockTestData';

jest.doMock('fs', () => ({
  readFileSync: jest.fn()
  .mockImplementation(function() {
    return JSON.stringify([mockCognitoUser, {...mockCognitoUser, email: 'demo-email2@demo-precisely.com'}]);
  })
}));

describe('seedCognito tests', function() {

  cognito.adminCreateUser = jest.fn()
    .mockImplementation(() => ({
        promise: jest.fn(() => ({ User: {Username: 'demo-username'} }))
      })
    )
    .mockImplementationOnce(() => ({
        promise: jest.fn(() => { throw new Error('mock Error'); })
      })
    );

  cognito.adminInitiateAuth = jest.fn(() => ({
      promise: jest.fn(() => ({Session: 'demo-session'}))
    }));

  cognito.adminRespondToAuthChallenge = jest.fn(() => ({
      promise: jest.fn()
    }));

  it('should fail when an error occurs', function() {
    seedCognito().catch(function(error: Error) {
      expect(error.message).toBe('mock Error');
    });
  });

  it('should pass and return userId array', function() {
    expect(seedCognito()).resolves.toEqual(['demo-username', 'demo-username']);
  });
});
