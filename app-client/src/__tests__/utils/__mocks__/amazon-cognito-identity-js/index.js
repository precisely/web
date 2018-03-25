/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

module.exports = {
  CognitoUserPool: jest.fn().mockImplementation(require('./CognitoUserPool')),
  CognitoUser: jest.fn().mockImplementation(require('./CognitoUser')),
  CognitoUserAttribute: jest.fn().mockImplementation(require('./CognitoUserAttribute')),
  AuthenticationDetails: jest.fn().mockImplementation(require('./AuthenticationDetails')),
}
