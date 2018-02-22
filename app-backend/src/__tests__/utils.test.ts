/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('aws-sdk', () => {
    return {
        KMS: () => ({
            decrypt: jest.fn()
                .mockImplementationOnce((
                        params: AWS.KMS.Types.DecryptRequest,
                        callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
                ) => {
                    callback(new Error('mock error'), null);
                })
                .mockImplementationOnce((
                        params: AWS.KMS.Types.DecryptRequest,
                        callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
                ) => {
                    callback(null, {Plaintext: new Buffer(JSON.stringify({demo: 'test'}))});
                })
        })
    };
});

import {getEnvironmentVariables, addEnvironmentToTableName} from '../utils';

const unroll = require('unroll');
unroll.use(it);

describe('Test for getEnvironmentVariables', () => {

    process.env.SECRETS = 'test';

    it('getEnvironmentVariables should be a function', () => {
        expect(typeof getEnvironmentVariables).toBe('function');
    });

    unroll('it should #description when #expectedResult', async (
            done: () => void,
            args: {expectedResult: string, description: string}
    ): Promise<void> => {
        const result = await getEnvironmentVariables();
        if (args.expectedResult === 'pass') {
            expect(result).toEqual({'demo': 'test'});
        } else {
            expect(result).toBeFalsy();
        }
        done();
    }, [
        ['expectedResult', 'description'],
        ['fail', 'return null'],
        ['pass', 'return data'],
    ]);
});

describe('Test for addEnvironmentToTableName', (): void => {
    process.env.NODE_ENV = 'dev';

    it('should add the environment to the table name.', (): void => {
        const result: string = addEnvironmentToTableName('test-table', '01');
        expect(result).toBe('dev-01-test-table');
    });
});
