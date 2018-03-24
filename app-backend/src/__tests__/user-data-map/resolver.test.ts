/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../user-data-map/models/UserDataMap');

import {userDataMapResolver, UserDataMapAttributes} from '../../user-data-map/api/resolver';

describe('UserDataMap resolver tests.', () => {

  describe('tests for get', () => {

    it('should pass when valid params are passed', async () => {
      let response: UserDataMapAttributes = await userDataMapResolver.get({
        userId: 'test',
      });

      expect(response.userId).toEqual('test');
      expect(response.vendorDataType).toEqual('test');
    });

    it('should throw error invalid params are passed', async () => {
      try {
        await userDataMapResolver.get({
          userId: 'invalid',
        });
      } catch (error) {
        expect(error.message).toEqual('No such user record found');
      }
    });
  });

  describe('tests for findOrCreate', () => {

    it('should pass when all data is passed', async () => {
      let response: UserDataMapAttributes = await userDataMapResolver.findOrCreate({
          userId: 'dummyId',
          vendorDataType: 'test'
        });
      expect(response.userId).toEqual('test');
      expect(response.vendorDataType).toEqual('test');
    });

    it('should throw error when data is missing', async () => {
      let response: UserDataMapAttributes = await userDataMapResolver.findOrCreate({
          userId: 'invalid',
          vendorDataType: 'test'
        });
      expect(response.message).toEqual('mock-findCreateFind error');
    });
  });

});
