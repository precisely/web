/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

function CognitoUserPool(data) {
  const {UserPoolId, ClientId} = data;
  this.userPoolId = UserPoolId;
  this.clientId = ClientId;
  this.getCurrentUser = jest.fn().mockImplementation(() => {
    return {
      user: 'cognitouserpool',
      signOut: jest.fn(),
    }
  });

  this.signUp = jest.fn((username, password, userAttributes, validationData, callback) => {
    username === 'xxx' ? callback({message: 'Error'}) : callback();
  });
}

module.exports = CognitoUserPool;