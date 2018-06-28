/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as AuthUtils from 'src/utils/auth';
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
    window.localStorage.setItem(AuthUtils.ACCESS_TOKEN_KEY, 'xyz'); // dummy token
    window.localStorage.setItem(AuthUtils.EXPIRES_IN_KEY, new Date().getTime().toString());
    AuthUtils.logout();
    expect(window.localStorage.getItem(AuthUtils.ACCESS_TOKEN_KEY)).toBeNull();
    expect(window.localStorage.getItem(AuthUtils.EXPIRES_IN_KEY)).toBeNull();
    expect(window.location.pathname).toBe('/');
  });

  unroll(
    'isAuthenticated test for #case',
    (done: () => void, testArgs: {accessToken: string, expiresAt: number, expected: string}) => {
      window.localStorage.setItem(AuthUtils.ACCESS_TOKEN_KEY, testArgs.accessToken);
      window.localStorage.setItem(AuthUtils.EXPIRES_IN_KEY, testArgs.expiresAt.toString());
      expect(AuthUtils.isAuthenticated()).toEqual(testArgs.expected);
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
