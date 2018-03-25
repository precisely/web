import * as AWS from 'aws-sdk';
import {genotypeIngester} from '../../../features/ingest/genotypeIngester';

const unroll = require('unroll');
unroll.use(it);

describe('genotypeIngester tests', function (): void {

  beforeEach(function() {
    genotypeResolver.create.mockClear();
  });

  const mockContext = jest.fn();
  genotypeResolver.create = jest.fn();

  AWS.S3 = function() {
    return {
      getObject: jest.fn()
      .mockImplementation(function(
        params: AWS.S3.Types.GetObjectRequest,
        callback: (error: Error, data: AWS.S3.Types.GetObjectOutput) => void
      ) {
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
    };
  };

  unroll('it should #expectedStatus with #description', function (
      done: () => void,
      args: {fileName: string; expectedStatus: string; description: string; }
  ): void {
    genotypeIngester({
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
      expect(genotypeResolver.create).toBeCalled();
    } else {
      expect(genotypeResolver.create).not.toBeCalled();
    }
    done();
  }, [
    ['fileName', 'expectedStatus', 'description'],
    ['fail', 'fail', 'S3 error occurs'],
    ['valid', 'pass', 'valid file content'],
    ['invalid', 'fail', 'invalid file content'],
  ]);
});
