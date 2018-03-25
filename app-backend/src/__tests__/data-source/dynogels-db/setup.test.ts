/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Context} from 'aws-lambda';
import {dynogels} from '../../../data-source/dynogels-db/connection';
import {setupDatabase} from '../../../data-source/dynogels-db/setup';

describe('setupDatabase tests.', function () {

  const MockContext = require('mock-lambda-context');
  let ctx: Context = new MockContext();

  dynogels.createTables = jest.fn()
    .mockImplementation(function (callback: (error: Error) => void) {
      callback(null);
    })
    .mockImplementationOnce(function (callback: (error: Error) => void) {
      callback(Error('dynogels.createTables mock error'));
    });

  it('setupDatabase should be a function', function() {
    expect(typeof setupDatabase).toBe('function');
  });

  it('should fail if dynogels.createTables throws error', function() {
    setupDatabase({}, ctx, function (error: Error, response: string) {
      expect(error.message).toEqual('Error while creating the tables.');
      expect(response).toBeNull();
    });
  });

  it('should pass if dynogels.createTables is successful', function() {
    setupDatabase({}, ctx, function(error: Error, response: string) {
      expect(response).toEqual('Tables Created Successfully');
      expect(error).toBeNull();
    });
  });
});
