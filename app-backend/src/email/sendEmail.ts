/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';

AWS.config.update({region: process.env.REGION});

const params: AWS.SES.Types.SendEmailRequest = {
  Destination: {
    ToAddresses: ['shishir.anshuman@causecode.com'] // We can send email from a verified email only.
  },
  Message: {
    Body: {
      Html: {
       Charset: 'UTF-8',
       Data: 'Hello! This is a test email from dev.'
      },
      Text: {
       Charset: 'UTF-8',
       Data: '<h3>Hello! This is a test email from dev.</h3>'
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Test email'
     }
    },
  Source: 'shishir.anshuman@causecode.com',
};       

const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

sendPromise.then((data) => {
  // The console.log will be replaced with the logger once that PR is merged.
  console.log('Message sent', data.MessageId);
}).catch((err) => {
  console.error(err, err.stack);
});
