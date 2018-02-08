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
                ): void => {
                    callback(new Error('mock error'), null);
                })
                .mockImplementationOnce((
                        params: AWS.KMS.Types.DecryptRequest,
                        callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
                ): void => {
                    callback(null, {Plaintext: new Buffer(JSON.stringify({demo: 'test'}))});
                })
        })
    };
});

import {getEnvironmentVariables} from '../utils';

const unroll = require('unroll');
unroll.use(it);

describe('Test for decryptKMS', (): void => {

    process.env.SECRETS = 'test';

    it('decryptKMS should be a function', (): void => {
        expect(typeof getEnvironmentVariables).toBe('function');
    });

    unroll('it should #expectedResult when #description', (
            done: () => void,
            args: {expectedResult: string, description: string}
    ): void => {
        getEnvironmentVariables()
            .then((data: {demo: string}): void => {
                expect(data).toBe({demo: 'test'});
            })
            .catch((error: Error): void => {
                expect(error.message).toBe('mock error');
            })
            .finally((): void => {
                done();
            });
    }, [
        ['expectedResult', 'description'],
        ['fail', 'KMS.decrypt throws error'],
        ['pass', 'KMS.decrypt calls success callback'],
    ]);
});