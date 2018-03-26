/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

function CognitoUserSession(data) {
  this.getIdToken = () => ({
    getJwtToken: jest.fn().mockReturnValue(data.jwtToken),
  })
}

module.exports = CognitoUserSession;
