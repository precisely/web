/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../user-data-map/models/UserDataMap');

import {userDataMapResolver, UserDataMapAttributes} from '../../user-data-map/api/resolver';
import {UserDataMapInstance} from '../../user-data-map/models/UserDataMap';
describe('UserDataMap resolver tests.', () => {

  describe('tests for list', () => {

    it('should pass when no params are passed', async () => {
      let responseList: UserDataMapInstance[] = await userDataMapResolver.list();
      let response: UserDataMapAttributes = responseList[0];
      expect(response.userId).toEqual('test');
      expect(response.vendorDataType).toEqual('test');
    });

    it('should pass when valid params are passed', async () => {
      let responseList: UserDataMapInstance[] = await userDataMapResolver.list({limit: 10, offset: 10});
      let response: UserDataMapAttributes = responseList[0];
      expect(response.userId).toEqual('test');
      expect(response.vendorDataType).toEqual('test');
    });

    it('should throw error invalid params are passed', async () => {
      let responseList: UserDataMapInstance[] = await userDataMapResolver.list({limit: -10});
      expect(responseList.message).toEqual('mock-findAll error');
    });
  });

  describe('tests for get', () => {

    it('should pass when valid params are passed', async () => {
      let response: UserDataMapAttributes = await userDataMapResolver.get({
        userId: 'test', 
        vendorDataType: 'test'
      });
      
      expect(response.userId).toEqual('test');
      expect(response.vendorDataType).toEqual('test');
    });

    it('should throw error invalid params are passed', async () => {
      try {
        let response: UserDataMapAttributes = await userDataMapResolver.get({
          userId: 'invalid', 
          vendorDataType: 'test'
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
