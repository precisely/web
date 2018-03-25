/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {seedCognito} from '../../seed-data/scripts/seedCognito';
import {
  saveJSONFile,
  removeDuplicate,
  createCognitoDataWithUser,
  createDBData
} from '../../seed-data/scripts/createFakeData';
import {log} from '../../logger';
const jsonfile = require('jsonfile');
const unroll = require('unroll');
unroll.use(it);

describe('createFakeData test', function() {

  jsonfile.writeFileSync = jest.fn();

  beforeEach(function() {
    jsonfile.writeFileSync.mockClear();
  });

  describe('removeDuplicate tests', function() {
    const duplicateElements = ['a', 'a', 'b', 'c', 'a'];

    it('should remove duplicates from the array passed', function() {
      expect(removeDuplicate(duplicateElements)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('saveJSONFile tests', function() {
    log.info = jest.fn();

    it('should create file with data passed', function() {
      saveJSONFile('test', [{demo: 'data'}]);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
      expect(log.info).toBeCalledWith('test created successfully.');
    });
  });

  describe('createCognitoDataWithUser tests', function() {
    seedCognito = jest.fn(function() { return ['demo', 'test']; });

    it('should save JSON file and call seedCognito', async function() {
      const userIdList = await createCognitoDataWithUser(2);
      expect(userIdList.length).toBe(2);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
      expect(seedCognito).toBeCalled();
    });
  });

  describe('createDBData tests', function() {
    it('should populate array with fake data and save it to JSON', function() {
      createDBData(1, ['demo-username']);
      expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(3);
    });
  });

});
