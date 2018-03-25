/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {toast} from 'react-toastify';
import {utils} from 'src/utils';

const unroll = require('unroll');
unroll.use(it);

describe('Tests for utils/index.ts', () => {

  toast.isActive = jest.fn().mockReturnValueOnce(true).mockReturnValue(false);

  unroll('it should test the isEmpty function when the object is #condition', (
      done: () => void,
      args: {condition: string, params: Object, result: boolean}
  ) => {
    expect(utils.isEmpty(args.params)).toEqual(args.result);
    done();
  }, [ // tslint:disable-next-line
    ['condition', 'params', 'result'],
    ['valid', {id: 1}, false],
    ['empty', {}, true]
  ]);

  it('should test getEnvironment and return the correct environment', () => {
    expect(utils.getEnvironment()).toEqual('test');

    process.env.NODE_ENV = '';
    expect(utils.getEnvironment()).toEqual('');
  });

  unroll('it should #operation the authentication token in the local storage', (
      done: () => void,
      args: {operation: string, tokenValue: string}
  ) => {
    localStorage.setItem = jest.fn<void>();
    utils.setTokenInLocalStorage(args.tokenValue);
    if (args.tokenValue) {
      expect(localStorage.setItem).toBeCalled();
    } else {
      expect(localStorage.setItem).not.toBeCalled();
    }
    done();
  }, [ // tslint:disable-next-line
    ['operation', 'tokenValue'],
    ['save', 'qwerty12345'],
    ['not save', '']
  ]);

  it('should delete the token from the local storage.', () => {
    localStorage.removeItem = jest.fn<void>();
    utils.removeTokenFromLocalStorage();
    expect(localStorage.removeItem).toBeCalledWith('AUTH_TOKEN');
  });

  it('should get the token from the local storage.', () => {
    localStorage.getItem = jest.fn().mockReturnValueOnce('DummyToken').mockReturnValueOnce(undefined);
    expect(utils.getTokenFromLocalStorage()).toEqual('DummyToken');
    expect(utils.getTokenFromLocalStorage()).toEqual('');
  });

  unroll('it should return #result when the params are (#email, #password, #toastId)', (
      done: () => void,
      args: {condition: string, email: string, password: string, toastId: number, result: boolean}
  ) => {
    expect(utils.checkEmailAndPassword(args.email, args.password, args.toastId)).toEqual(args.result);
    done();
  }, [ // tslint:disable-next-line
    ['email', 'password', 'toastId', 'result'],
    ['', '', 100, {isValid: false, toastId: 100}],
    ['', 'dummyPassword', '', {isValid: false, toastId: 1}],
    ['test@example.com', '', '', {isValid: false, toastId: 2}],
    ['test@example.com', 'dummy', '', {isValid: false, toastId: 3}],
    ['test@example.com', 'dummyPassword', 100, {isValid: true, toastId: 100}],
  ]);
});
