/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
jest.mock('fs');
jest.mock('../../../features/user-data/models/UserDataMap');

import {seedUser} from '../../../seed-data/scripts/seedPostgres';
import {mockUserDataMap} from '../../constants/seedData';

const fs = require('fs');

describe('seedPostgres tests', function() {

  process.exit = jest.fn<never>();

  fs.readFileSync = jest.fn()
    .mockImplementation(function() {
      return JSON.stringify([mockUserDataMap]);
    })
    .mockImplementationOnce(function() {
      return JSON.stringify([{ ...mockUserDataMap, user_id: 'invalid' }]);
    });

  it('should fail when error occurs while updation/insertion', async function() {
    try {
      await seedUser();
    } catch (error) {
      expect(process.exit).not.toBeCalled();
    }
  });

  it('should exit successfully when updated/inserted successfully', async function() {
    await seedUser();
    expect(process.exit).toBeCalled();
  });
});
