/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/utils/index');

import {currentUser} from 'src/constants/currentUser';
import { utils } from '../../utils';

const unroll = require('unroll');
unroll.use(it);

describe('Testing user utility methods', () => {
  const successCallback = jest.fn();
  const failureCallback = jest.fn();

  beforeEach(() => {
    successCallback.mockReset();
    failureCallback.mockReset();
  });

  it('should clear the accessToken after logout and redirect to home', () => {
    currentUser.logout();
    expect(utils.setAuthStorage).toBeCalled();
    expect(window.location.pathname).toBe('/');
  });

  unroll(
      'isAuthenticated test for #case',
      (done: () => void, testArgs: {accessToken: string, expiresAt: number, expected: string}) => {
        window.localStorage.setItem('accessToken', testArgs.accessToken);
        window.localStorage.setItem('expiresAt', testArgs.expiresAt.toString());
        expect(currentUser.isAuthenticated()).toEqual(testArgs.expected);
        done();
      },
      [
        ['case', 'accessToken', 'expiresAt', 'expected'], // Different combinations for the two
        ['localStorage is empty', '', '', false],
        ['no accessToken and expiresAt equals to now', '', new Date().getTime(), false],
        ['no accessToken and expiresAt greater than now', '', new Date().getTime() + 60000, false],
        ['accessToken present but no expiresAt', 'xyz', '', false],
        ['accessToken present and expiresAt equal to now', 'xyz', new Date().getTime(), false],
        ['accessToken present and expiresAt greater than now', 'xyz', new Date().getTime() + 60000, 'xyz'],
      ]
  );
});
