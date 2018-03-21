/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {seedCognito} from '../../seed-data/scripts/seedCognito';
import {
  saveJSONfile, 
  removeDuplicate, 
  createCognitoDataWithUser, 
  createDBData
} from '../../seed-data/scripts/createFakeData';
import {log} from '../../logger';
const jsonfile = require('jsonfile');
const unroll = require('unroll');
unroll.use(it);

describe('createFakeData test', () => {
  
  jsonfile.writeFileSync = jest.fn();
  
  beforeEach(() => {
    jsonfile.writeFileSync.mockClear();
  });

  describe('removeDuplicate tests', () => {
    const duplicateElements = ['a', 'a', 'b', 'c', 'a'];

    it('should remove duplicates from the array passed', () => {
      expect(removeDuplicate(duplicateElements)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('saveJSONfile tests', () => {
    log.info = jest.fn();

    it('should create file with data passed', () => {
      saveJSONfile('test', [{demo: 'data'}]);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
      expect(log.info).toBeCalledWith('test created successfully.');
    });
  });
  
  describe('createCognitoDataWithUser tests', () => {
    seedCognito = jest.fn(() => ['demo', 'test']);

    it('should save JSON file and call seedCognito', async () => {
      const userIdList = await createCognitoDataWithUser(2);
      expect(userIdList.length).toBe(2);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
      expect(seedCognito).toBeCalled();
    });
  });

  describe('createDBData tests', () => {
    it('should populate array with fake data and save it to JSON', () => {
      createDBData(1, ['demo-username']);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(3);
    });
  });

});
