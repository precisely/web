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
    window.localStorage.setItem(AuthUtils.LS_AUTH_ACCESS_TOKEN, 'xyz'); // dummy token
    window.localStorage.setItem(AuthUtils.LS_AUTH_ID_TOKEN, 'abc123');
    window.localStorage.setItem(AuthUtils.LS_AUTH_EXPIRES_IN, new Date().getTime().toString());
    window.localStorage.setItem(AuthUtils.LS_AUTH_USER, { name: 'alice@example.com' }.toString());
    AuthUtils.logout();
    expect(window.localStorage.getItem(AuthUtils.LS_AUTH_ACCESS_TOKEN)).toBeNull();
    expect(window.localStorage.getItem(AuthUtils.LS_AUTH_ID_TOKEN)).toBeNull();
    expect(window.localStorage.getItem(AuthUtils.LS_AUTH_EXPIRES_IN)).toBeNull();
    expect(window.localStorage.getItem(AuthUtils.LS_AUTH_USER)).toBeNull();
    expect(window.location.pathname).toBe('/');
  });

  unroll(
    'isAuthenticated test for #case',
    (done: () => void, testArgs: {accessToken: string, expiresAt: number, expected: string}) => {
      window.localStorage.setItem(AuthUtils.LS_AUTH_ACCESS_TOKEN, testArgs.accessToken);
      window.localStorage.setItem(AuthUtils.LS_AUTH_EXPIRES_IN, testArgs.expiresAt.toString());
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

