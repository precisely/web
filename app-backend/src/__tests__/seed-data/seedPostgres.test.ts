/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../user-data-map/models/UserDataMap');

import './__mocks__/seedPostgresMocks';
import {seedUser} from '../../seed-data/scripts/seedPostgres';

describe('seedPostgres tests', () => {
  process.exit = jest.fn();

  it('should fail when error occurs while updation/insertion', async () => {
    try {
      await seedUser();
    } catch (error) {
      expect(process.exit).not.toBeCalled();
    }
  });

  it('should exit successfully when updated/inserted successfully', async () => {
    await seedUser();
    expect(process.exit).toBeCalled();
  });
});
