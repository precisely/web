let AWS: any = jest.genMockFromModule('aws-sdk');

export let KMS = AWS.KMS;
export let SES = AWS.SES;

export const config = {
  update: jest.fn().mockImplementation(jest.fn())
};

// KMS Mocking
export let mockedDecrypt = jest.fn((params, callback) => {
  callback(null, {Plaintext: new Buffer(JSON.stringify({demo: 'test'}))});
});

KMS.mockImplementation(() => ({
    decrypt: mockedDecrypt
}));

// SES Mocking
export let mockedSendEmail = jest.fn(() => {
  return {
    promise: jest.fn(() => {
      return {MessageId: 'dummyMessage'};
    })
  };
});

SES.mockImplementation(() => ({
  sendEmail: mockedSendEmail
}));
