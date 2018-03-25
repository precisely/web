/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');

import * as fs from 'fs';
import {cognito, seedCognito} from '../../seed-data/scripts/seedCognito';

const jsonfile = require('jsonfile');

describe('seedCognito tests', function() {
  const dummyUser = {
    firstName: 'demo-firstName',
    lastName: 'demo-lastName',
    email: 'demo-email@demo-precisely.com',
    password: 'demo-password',
    roles: 'demo-roles'
  };

  fs.readFileSync = jest.fn()
    .mockImplementation(function() {
      return JSON.stringify([dummyUser, {...dummyUser, email: 'demo-email2@demo-precisely.com'}]);
    });

  cognito.adminCreateUser = jest.fn()
    .mockImplementation(function() {
      return {
        promise: jest.fn(function() {
          return {User: {Username: 'demo-username'}};
        })
      };
    })
    .mockImplementationOnce(function() {
      return {
        promise: jest.fn(function() { throw new Error('mock Error'); })
      };
    });

  cognito.adminInitiateAuth = jest.fn()
    .mockImplementation(function() {
      return {
        promise: jest.fn(function() {
          return {Session: 'demo-session'};
        })
      };
    });

  cognito.adminRespondToAuthChallenge = jest.fn()
    .mockImplementation(function() {
      return {
        promise: jest.fn()
      };
    });

  it('should fail when an error occurs', function() {
    seedCognito().catch(function(error: Error) {
      expect(error.message).toBe('mock Error');
    });
  });

  it('should pass and return userId array', function() {
    expect(seedCognito()).resolves.toEqual(['demo-username', 'demo-username']);
  });
});
