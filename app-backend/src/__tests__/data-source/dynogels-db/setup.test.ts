/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {dynogels} from 'src/data-source/dynogels-db/connection';
import {setupDatabase} from 'src/data-source/dynogels-db/setup';

describe('setupDatabase tests.', () => {

  const mockContext = jest.fn();
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
    setupDatabase({}, mockContext, (error: Error, response: string) => {
      expect(error.message).toEqual('Error while creating the tables.');
      expect(response).toBeNull();
    });
  });

  it('should pass if dynogels.createTables is successful', () => {
    setupDatabase({}, mockContext, (error: Error, response: string) => {
      expect(response).toEqual('Tables Created Successfully');
      expect(error).toBeNull();
    });
  });
});
