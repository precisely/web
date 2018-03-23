/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import './__mocks__/seedCognitoMocks';
import {cognito, seedCognito} from '../../seed-data/scripts/seedCognito';

describe('seedCognito tests', () => {
  cognito.adminCreateUser = jest.fn()
    .mockImplementation(() => {
      return {
        promise: jest.fn(() => ({ User: { Username: 'demo-username' } }))
      };
    })
    .mockImplementationOnce(() => {
      return {
        promise: jest.fn(() => { throw new Error('mock Error'); })
      };
    });

  cognito.adminInitiateAuth = jest.fn()
    .mockImplementation(() => {
      return {
        promise: jest.fn(() => ({ Session: 'demo-session' }))
      };
    });

  cognito.adminRespondToAuthChallenge = jest.fn()
    .mockImplementation(() => {
      return {
        promise: jest.fn()
      };
    });

  it('should fail when an error occurs', () => {
    seedCognito().catch((error) => {
      expect(error.message).toBe('mock Error');
    });
  });

  it('should pass and return userId array', () => {
    expect(seedCognito()).resolves.toEqual(['demo-username', 'demo-username']);
  });
});
