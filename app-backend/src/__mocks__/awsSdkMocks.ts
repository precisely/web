/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('aws-sdk', () => ({
  S3: () => ({
    getObject: jest.fn().mockImplementation((
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
  }),

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
  }),

  SharedIniFileCredentials: jest.fn(),
}));
