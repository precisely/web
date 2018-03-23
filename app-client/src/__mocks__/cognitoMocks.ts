/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.doMock('src/utils/cognito', () => ({
  getResetPasswordCode: jest.fn<void>()
      .mockImplementationOnce((email: string, successCallback?: () => void) => { successCallback(); })
      .mockImplementationOnce((email: string, successCallback?: () => void, failureCallback?: () => void) => {
        failureCallback();
      }),

  signup: jest.fn<void>()
      .mockImplementationOnce((email: string, password: string, successCallback?: () => void) => { successCallback(); })
      .mockImplementationOnce((
          email: string,
          password: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ) => {
        failureCallback();
      }),

  login: jest.fn<void>()
      .mockImplementationOnce((email: string, password: string, successCallback?: () => void) => { successCallback(); })
      .mockImplementationOnce((
          email: string,
          password: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ) => {
        failureCallback();
      }),

  resetPassword: jest.fn<void>()
      .mockImplementationOnce((
          email: string,
          verificationCode: string,
          newPassword: string,
          successCallback?: () => void,
      ) => { successCallback(); })
      .mockImplementationOnce((
          email: string,
          verificationCode: string,
          newPassword: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ) => {
        failureCallback();
      }),
}));
