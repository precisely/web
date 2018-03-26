/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');
jest.mock('aws-sdk');

import * as AWS from 'aws-sdk';
import {seedCognito} from '../../../seed-data/scripts/seedCognito';
import {mockCognitoUser} from '../../constants/seedData';

const fs = require('fs');

describe('seedCognito tests', function() {

  const dummyReadData = [mockCognitoUser, {...mockCognitoUser, email: 'demo-email2@demo-precisely.com'}];

  it('should fail when cognito error occurs', function() {
    // @ts-ignore
    AWS.mockedAdminCreateUser.mockImplementationOnce(() => { throw new Error('mock Error'); });
    fs.setMockReadFileSync.mockImplementationOnce(() => JSON.stringify(dummyReadData));
    expect(seedCognito()).rejects.toEqual(new Error('mock Error'));
  });

  it('should fail when fs error occurs', function() {
    // @ts-ignore
    fs.setMockReadFileSync.mockImplementationOnce(() => { throw new Error('mock Error'); });
    expect(seedCognito()).rejects.toEqual(new Error('mock Error'));
  });

  it('should pass and return userId array', function() {
    fs.setMockReadFileSync.mockImplementationOnce(() => JSON.stringify(dummyReadData));
    expect(seedCognito()).resolves.toEqual(['demo-username', 'demo-username']);
  });
});
