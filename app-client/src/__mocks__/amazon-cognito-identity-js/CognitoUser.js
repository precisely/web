/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

function CognitoUser(data) {
  this.data = {
    email: 'test@example.com',
    name: 'Test User',
  };

  this.confirmPassword = jest.fn((verificationCode, newPassword, {onSuccess, onFailure}) => {
     verificationCode !== 'xxx' ? onSuccess() : onFailure({message: 'Error'});
  });

  this.forgotPassword = jest.fn(({onSuccess, onFailure}) => onSuccess());

  this.authenticateUser = jest.fn((authenticationDetails, {onSuccess, onFailure}) => {
    if (authenticationDetails.username === 'xxx') {
      onFailure({message: 'ERROR'});
      return;
    }

    onSuccess({
      getIdToken: jest.fn(() => ({
        getJwtToken: jest.fn().mockReturnValue('DUMMY_TOKEN'),
      }))
    });
  });
}

module.exports = CognitoUser;