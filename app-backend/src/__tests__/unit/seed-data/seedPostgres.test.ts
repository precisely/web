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

  it('should fail when error occurs while parsing file', async function() {
    try {
      fs.setMockReadFileSync.mockImplementationOnce(() => { throw new Error('mock error'); });
      await seedUser();
    } catch (error) {
      expect(error.message).toBe('mock error');
      expect(process.exit).not.toBeCalled();
    }
  });

  it('should fail when error occurs while updation/insertion', async function() {
    try {
      fs.setMockReadFileSync.mockImplementationOnce(() =>
          JSON.stringify([{...mockUserDataMap, user_id: 'invalid'}])
      );
      await seedUser();
    } catch (error) {
      expect(error.message).toBe('mock-upsert error');
      expect(process.exit).not.toBeCalled();
    }
  });

  it('should exit successfully when updated/inserted successfully', async function() {
    fs.setMockReadFileSync.mockImplementationOnce(() => JSON.stringify([mockUserDataMap]));
    await seedUser();
    expect(process.exit).toBeCalled();
  });
});
