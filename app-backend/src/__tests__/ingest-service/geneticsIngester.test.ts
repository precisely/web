import * as AWS from 'aws-sdk';
import {geneticsIngester} from '../../ingest-service/geneticsIngester';
import {geneticsResolver} from '../../genetics-service/api/resolver';

const unroll = require('unroll');
unroll.use(it);

describe('geneticsIngester tests', (): void => {

    beforeEach(() => {
        geneticsResolver.create.mockClear();
    });

    const mockContext = jest.fn();
    geneticsResolver.create = jest.fn();

    AWS.S3 = () => ({
        getObject: jest.fn()
            .mockImplementation((
                params: AWS.S3.Types.GetObjectRequest,
                callback: (error: Error, data: AWS.S3.Types.GetObjectOutput) => void
            ) => {
                if (params.Key === 'valid') {
                    callback(null, {
                        Body: JSON.stringify([{
                            attributes: {
                                sample: 'demo',
                                source: 'demo',
                                variant: 'demo',
                                variant_call: 'demo',
                            }
                        }])
                    });
                } else if (params.Key === 'invalid') {
                    callback(null, {Body: undefined});
                } else {
                    callback(new Error('mock error'), null);
                }
            })
    });

    unroll('it should #expectedStatus with #description', (
            done: () => void,
            args: {fileName: string; expectedStatus: string; description: string; }
    ): void => {
        geneticsIngester({
            Records: [
                {
                    s3: {
                        bucket: {
                            name: 'demoBucket'
                        },
                        object: {
                            key: args.fileName
                        }
                    }
                }
            ]
        }, mockContext);
        if (args.expectedStatus === 'pass') {
            expect(geneticsResolver.create).toBeCalled();
        } else {
            expect(geneticsResolver.create).not.toBeCalled();
        }
        done();
    }, [
        ['fileName', 'expectedStatus', 'description'],
        ['fail', 'fail', 'S3 error occurs'],
        ['valid', 'pass', 'valid file content'],
        ['invalid', 'fail', 'invalid file content'],
    ]);
});
