/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {
    isEmpty,
    getEnvironment,
    setTokenInLocalStorage,
    removeTokenFromLocalStorage,
    validateEmailAndPassword
} from 'src/utils';

const unroll = require('unroll');
unroll.use(it);

describe('Tests for utils/index.ts', (): void => {

    unroll('it should test the isEmpty function when the object is #condition', (
            done: () => void,
            args: {condition: string, params: Object, result: boolean}
    ): void => {
        expect(isEmpty(args.params)).toEqual(args.result);
        done();
    }, [ // tslint:disable-next-line
        ['condition', 'params', 'result'],
        ['valid', {id: 1}, false],
        ['empty', {}, true]
    ]);

    it('should test getEnvironment and return the correct environment', (): void => {
        expect(getEnvironment()).toEqual('test');
    });

    unroll('it should #operation the authentication token in the local storage', (
            done: () => void,
            args: {operation: string, tokenValue: string}
    ): void => {
        localStorage.setItem = jest.fn<void>();
        setTokenInLocalStorage(args.tokenValue);
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

    it('should delete the token from the local storage.', (): void => {
        localStorage.removeItem = jest.fn<void>();
        removeTokenFromLocalStorage();
        expect(localStorage.removeItem).toBeCalledWith('AUTH_TOKEN');
    });

    unroll('it should return #result when the params are #params', (
            done: () => void,
            // tslint:disable-next-line
            args: {condition: string, params: Array<any>, result: boolean}
    ): void => {
        expect(validateEmailAndPassword(...args.params)).toEqual(args.result);
        done();
    }, [ // tslint:disable-next-line
        ['params', 'result'],
        [['', '', null], {isValid: false, toastId: 1}],
        [['', 'dummyPassword', null], {isValid: false, toastId: 2}],
        [['test@example.com', '', null], {isValid: false, toastId: 3}],
        [['test@example.com', 'dummy', null], {isValid: false, toastId: 4}],
        [['test@example.com', 'dummyPassword', null], {isValid: true, toastId: null}],
    ]);
});