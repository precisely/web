jest.mock('aws-sdk', () => {
  return {
    SSM: () => ({
      getParameter: jest.fn().mockImplementation((x: AWS.SSM.Types.GetParameterRequest) => ({
        promise: jest.fn().mockImplementation(() => {
          const res: AWS.SSM.Types.GetParameterResult = {
            Parameter: {
              Value: 'sample-key'
            }
          };
          return res;
        })
      }))
    })
  };
});

const mockSetApiKey = jest.fn();
const mockSend = jest.fn();

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: mockSetApiKey,
    send: mockSend
  };
});

import * as AWS from 'aws-sdk';
import { EmailService } from './service';

import {log} from 'src/common/logger';

describe('SendGrid email tests', () => {

  log.info = jest.fn();
  log.error = jest.fn();

  it('should call SendGrid APIs and return true on success', async () => {
    const sendRes = await EmailService.send({to: 'alice@example.com', subject: 'test subject', line1: 'test line 1', line2: 'test line 2', link: 'link text'});
    expect(mockSetApiKey).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalled();
    expect(sendRes).toBeTruthy();
  });

  it('should call SendGrid APIs and return false on failure', async () => {
    mockSend.mockImplementationOnce((...x) => {
      throw 'error';
    });
    const sendRes = await EmailService.send({to: 'alice@example.com', subject: 'test subject', line1: 'test line 1', line2: 'test line 2', link: 'link text'});
    expect(mockSetApiKey).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalled();
    expect(sendRes).toBeFalsy();
  });

});
