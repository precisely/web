/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
jest.mock('../../../../../features/genotype/services/GenotypeService');
jest.mock('../../../../../features/user-data/services/UserDataMapService');

import {GenotypeService} from '../../../../../features/genotype/services/GenotypeService';
import {UserDataMapService} from '../../../../../features/user-data/services/UserDataMapService';
import {UserData} from '../../../../../features/user-data/utils/UserData';
import {log} from '../../../../../logger';

const unroll = require('unroll');
unroll.use(it);

describe('UserData tests.', function() {

  log.error = jest.fn();

  let userData = new UserData('demo-id', ['demo', 'gene']);

  it('should be an instance', function() {
    expect(userData).toBeInstanceOf(UserData);
    expect(userData.getGenotypes).toBeInstanceOf(Function);
  });

  it('should log and return error if no user found', async function() {
    try {
      UserDataMapService.getOpaqueId = jest.fn(() => { throw new Error('No such user record found'); });
      await userData.getGenotypes();
    } catch (error) {
      expect(error.message).toBe('No such user record found');
      expect(log.error).toBeCalledWith('UserData-getGenotypes: No such user record found');
    }
  });

  it('should return genotype list if successful', async function() {
    // @ts-ignore
    UserDataMapService.__resetUserDataMapServiceMock();
    await userData.getGenotypes();
    expect(UserDataMapService.getOpaqueId).toBeCalledWith('demo-id', 'precisely:genetics');
    expect(GenotypeService.getGenotypes).toBeCalledWith('demo-id', ['demo', 'gene']);
  });

});
