jest.mock('aws-sdk', () => {
    return {
        KMS: () => ({
            decrypt: jest.fn((
                        params: AWS.KMS.Types.DecryptRequest, 
                        callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
                ): void => {
                    callback(null, {Plaintext: new Buffer(JSON.stringify({demo: 'test'}))});
                })
                .mockImplementationOnce((
                    params: AWS.KMS.Types.DecryptRequest, 
                    callback: (error: Error, data: AWS.KMS.Types.DecryptResponse) => void
                ): void => {
                    callback(new Error('mock error'), null)
                })
        })
    }
});

import {decryptKMS} from '../utils';

const unroll = require('unroll');
unroll.use(it);

describe('Test for decryptKMS', (): void => {
    it('decryptKMS should be a function', (): void => {
        expect(typeof decryptKMS).toBe('function');
    });

    unroll('it should #expectedResult when #description', (
            done: () => void,
            args: {expectedResult: string, description: string}
    ): void => {
        decryptKMS('testData')
            .then((data: {demo: string}) => {
                expect(data).toBe({demo: 'test'});
            })
            .catch((error: Error) => {
                expect(error.message).toBe('mock error');
            })
            .finally(() => {
                done();
            });
    }, [
        ['expectedResult', 'description'],
        ['fail', 'KMS.decrypt throws error'],
        ['pass', 'KMS.decrypt calls success callback'],
    ])
});
