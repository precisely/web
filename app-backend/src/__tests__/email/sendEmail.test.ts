/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('aws-sdk', () => {
  return {
    SES: (params: {apiVersion: string}) => ({
      sendEmail: jest.fn().mockImplementationOnce((emailData: AWS.SES.Types.SendEmailRequest) => ({
        promise: jest.fn().mockImplementation(() => {
          if (emailData.Source !== 'test@precise.ly') {
            return {MessageId: 'dummyMessage'};
          } else {
            let error = new Error();
            error.stack = 'A dummy stacktrace.';
            throw error;
          }
        })
      }))
    }),
    config: (() => ({
      update: jest.fn().mockImplementation(jest.fn()),
    }))(),
  };
});

import * as AWS from 'aws-sdk';
import {log} from '../../logger';
import {sendEmail} from '../../email/sendEmail';

describe('sendEmail tests', () => {

  log.info = jest.fn();
  log.error = jest.fn();

  it('should log a success message when the email is sent.', async () => {
    await sendEmail(['test@example.com', ], 'janedoe', 'Dummy subject', 'I am a test message');
    expect(log.info).toBeCalledWith('Email sent: dummyMessage');
  });

  it('should log an error message when the email is not sent.', async () => {
    await sendEmail(['test@example.com', ], 'test', 'Dummy subject', 'I am a test message');
    expect(log.error).toBeCalledWith('Error occured while sending email: A dummy stacktrace.');
  });
});
