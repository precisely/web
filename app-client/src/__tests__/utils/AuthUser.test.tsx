/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {currentUser} from 'src/constants/currentUser';

describe('AuthUser tests', () => {
  const successCallback = jest.fn();
  const failureCallback = jest.fn();

  beforeEach(() => {
    successCallback.mockReset();
    failureCallback.mockReset();
  });

  it('should set the window location to base after logout ', () => {
    currentUser.logout();
    expect(window.location.href).toEqual('http://localhost/');
  });

  it('should set auth0Options after onAuthentication is called', () => {
    currentUser.onAuthentication({
      accessToken: 'dummyToken',
      expiresIn: 200,
      idToken: 'dummyAccountToken',
      idTokenPayload: null,
      state: null,
      tokenType: ''
    });
    expect(currentUser.auth0Options).toBeTruthy();
  });

  it('should call show method of Auth-Lock',()=>{
    currentUser.showLogin();
    expect(currentUser.lock.show).toBeCalled();
  });
});
