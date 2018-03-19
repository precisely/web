/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {log} from '../logger';

AWS.config.update({region: process.env.REGION});

export const sendEmail = async (recipients: string[], senderUsername: string, subject: string, message: string) => {

  const params: AWS.SES.Types.SendEmailRequest = {
    Destination: {ToAddresses: recipients},
    Message: {
      Body: {
        /**
         * This is just for the demonstration purpose. The email templates can be added when the email content and the
         * design is decided.
         */
        Text: {Charset: 'UTF-8', Data: message},
      },
      Subject: {Charset: 'UTF-8', Data: subject}
    },
    Source: `${senderUsername}@precise.ly`,
  };

  try {
    const sendPromise = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    log.info(`Email sent: ${sendPromise.MessageId}`);
  } catch (error) {
    log.error(`Error occured while sending email: ${error.stack}`);
  }
};
