/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Context} from 'aws-lambda';
import {dynogels} from '../../dynogels-db/connection';
import {setupDatabase} from '../../dynogels-db/setup';

const MockContext = require('mock-lambda-context');

describe('setupDatabase tests.', () => {

  let ctx: Context;

  beforeEach(() => {
    ctx = new MockContext();
  });

  dynogels.createTables = jest.fn()
    .mockImplementation(callback => {
      callback(null);
    })
    .mockImplementationOnce(callback => {
      callback(Error('dynogels.createTables mock error'));
    });

  it('setupDatabase should be a function', () => {
    expect(typeof setupDatabase).toBe('function');
  });

  it('should fail if dynogels.createTables throws error', () => {
    setupDatabase({}, ctx, (error: Error, response: string) => {
      expect(error.message).toEqual('Error while creating the tables.');
      expect(response).toBeNull();
    });
  });

  it('should pass if dynogels.createTables is successful', () => {
    setupDatabase({}, ctx, (error: Error, response: string) => {
      expect(response).toEqual('Tables Created Successfully');
      expect(error).toBeNull();
    });
  });
});
