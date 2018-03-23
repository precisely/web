import '../../__mocks__/awsSdkMocks';
import {Context} from 'aws-lambda';
import {genotypeIngester} from '../../ingest-service/genotypeIngester';
import {genotypeResolver} from '../../genotype-service/api/resolver';

const MockContext = require('mock-lambda-context');
const unroll = require('unroll');
unroll.use(it);

describe('genotypeIngester tests', (): void => {

  let ctx: Context;

  beforeEach(() => {
    jest.resetAllMocks();
    ctx = new MockContext();
  });

  genotypeResolver.create = jest.fn();

  unroll('it should #expectedStatus with #description', (
      done: () => void,
      args: {fileName: string; expectedStatus: string; description: string; }
  ): void => {
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
    }, ctx);
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
