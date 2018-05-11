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

describe('seedCognito tests', () => {
  const dummyUser = {
    firstName: 'demo-firstName',
    lastName: 'demo-lastName',
    email: 'demo-email@demo-precisely.com',
    password: 'demo-password',
    roles: 'demo-roles'
  };

  fs.readFileSync = jest.fn()
    .mockImplementation(() => {
      return JSON.stringify([dummyUser, {...dummyUser, email: 'demo-email2@demo-precisely.com'}]);
    });

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
