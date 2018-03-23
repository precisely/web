/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/utils');

import * as Cognito from 'src/utils/cognito';
import {setTokenInLocalStorage, removeTokenFromLocalStorage} from 'src/utils';

const unroll = require('unroll');
unroll.use(it);

describe('Cognito tests', () => {
  const successCallback = jest.fn();
  const failureCallback = jest.fn();

  beforeEach(() => {
    successCallback.mockReset();
    failureCallback.mockReset();
  });

  unroll('It should return #value if the user is #condition', (
        done: () => void,
        args: {value: string, condition: string}
  ) => {
    expect(Cognito.isLoggedIn()).toBe(args.value);
    done();
  }, [ // tslint:disable-next-line
    ['value', 'condition'],
    [false, 'not logged in'],
    [true, 'logged in'],
  ]);

  it('should return the current user details', () => {
    const currentUser = Cognito.getCognitoUser('test@example.com');
    expect(currentUser[`data`].name).toEqual('Test User');
  });

  it('should remove the token from the local storage when signout is called.', () => {
    Cognito.logOut();
    expect(removeTokenFromLocalStorage).toBeCalled();
  });

  describe('Reset password tests', () => {
    unroll('It should call the #callbackType callback when there is #condition ', (
        done: () => void,
        args: {callbackType: string, condition: string, verificationCode: string, function: jest.Mock}
    ) => {
      Cognito.resetPassword('test@example.com', args.verificationCode, 'qwerty123', successCallback, failureCallback);
      expect(args.function).toBeCalled();
      done();
    }, [ // tslint:disable-next-line
      ['callbackType', 'condition', 'verificationCode', 'function'],
      ['success', 'no error', '13456', successCallback],
      ['failure', 'an error', 'xxx', failureCallback],
    ]);
  });

  describe('Forgot password tests.', () => {
    unroll('It should call the #callbackType callback when there is #condition ', (
        done: () => void,
        args: {callbackType: string, condition: string, function: jest.Mock}
    ) => {
      Cognito.getResetPasswordCode('test@example.com', successCallback, failureCallback);
      expect(args.function).toBeCalled();
      done();
    }, [ // tslint:disable-next-line
      ['callbackType', 'condition', 'function'],
      ['success', 'no error', successCallback],
    ]);
  });

  describe('Signup tests.', () => {
    unroll('It should call the #callbackType callback when there is #condition ', (
        done: () => void,
        args: {callbackType: string, condition: string, function: jest.Mock, email: string}
    ) => {
      Cognito.signup(args.email, 'qwerty', successCallback, failureCallback);
      expect(args.function).toBeCalled();
      done();
    }, [ // tslint:disable-next-line
      ['callbackType', 'condition', 'function', 'email'],
      ['success', 'no error', successCallback, 'test@example.com'],
      ['failure', 'an error', failureCallback, 'xxx'],
    ]);
  });

  describe('Login tests', () => {
    it('should save the token to the local storage on successful login', () => {
      Cognito.login('test@example.com', 'qwerty', successCallback, failureCallback);
      expect(setTokenInLocalStorage).toBeCalledWith('DUMMY_TOKEN');
      expect(successCallback).toBeCalled();
    });

    it('should call the failure callback on failure.', () => {
      Cognito.login('xxx', 'qwerty', successCallback, failureCallback);
      expect(failureCallback).toBeCalled();
    });
  });
});
