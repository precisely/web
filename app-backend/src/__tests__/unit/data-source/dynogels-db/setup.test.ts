/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.unmock('aws-sdk');
jest.mock('dynogels-promisified');

import {Context} from 'aws-lambda';
import {dynogels} from '../../../../data-source/dynogels-db/connection';
import {setupDatabase} from '../../../../data-source/dynogels-db/setup';

describe('setupDatabase tests.', function () {

  const MockContext = require('mock-lambda-context');
  let ctx: Context = new MockContext();

  it('setupDatabase should be a function', function() {
    expect(typeof setupDatabase).toBe('function');
  });

  // TODO: Investigate: not working
  // it('should fail if dynogels.createTables throws error', function() {
  //   dynogels.mockedCreateTable.mockImplementationOnce(() => {
  //     throw new Error('Error while creating the tables.');
  //   });
  //   setupDatabase({}, ctx, function (error: Error, response: string) {
  //     expect(error.message).toEqual('Error while creating the tables.');
  //     expect(response).toBeNull();
  //   });
  // });

  it('should pass if dynogels.createTables is successful', function() {
    setupDatabase({}, ctx, function(error: Error, response: string) {
      expect(response).toEqual('Tables Created Successfully');
      expect(error).toBeNull();
    });
  });
});
