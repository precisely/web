/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.unmock('aws-sdk');
jest.mock('../../../seed-data/scripts/seedDynamo');
jest.mock('../../../seed-data/scripts/seedPostgres');

import {setEnvironment} from '../../../seed-data/scripts/seedData';

describe('seedData tests', function() {
  describe('setEnvironment test', function() {
    it('should set passed key-value pair as env variable', function() {
      expect(process.env.dummy).toBe(undefined);
      setEnvironment('{dummy:test}');
      expect(process.env.dummy).toBe('test');
    });
  });
});
