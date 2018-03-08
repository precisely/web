/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');
jest.mock('../../user-data-map/models/UserDataMap');

import * as fs from 'fs';
import {seedUser} from '../../seed-data/scripts/seedPostgres';

describe('seedPostgres tests', () => {

  const dummyUser = {
    user_id: 'dummyId',
    opaque_id: 'a72078c2-83c3-465d-9526-d80622dd01b3',
    vendor_data_type: 'precisely:genotype'
  };
  process.exit = jest.fn();

  fs.readFileSync = jest.fn()
    .mockImplementation(() => {
      return JSON.stringify([dummyUser]);
    })
    .mockImplementationOnce(() => {
      return JSON.stringify([{ ...dummyUser, user_id: 'invalid' }]);
    });

  it('should pass when user is updated/inserted successfully', async () => {
    try {
      await seedUser();
    } catch (error) {
      expect(process.exit).not.toBeCalled();
    }
  });

  it('should pass when user is updated/inserted successfully', async () => {
    await seedUser();
    expect(process.exit).toBeCalled();
  });
});
