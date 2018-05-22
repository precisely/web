/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
function mockCurrentUser() {
  return {
    signup: jest.fn(),
    __mockSignupSuccessCase() {
      currentUser.signup.mockImplementationOnce(
        (email: string, password: string, onSuccess: () => void) => {
          onSuccess();
        }
      );
    },
    __mockSignupFailureCase() {
      currentUser.signup.mockImplementationOnce(
        (
          email: string,
          password: string,
          onSuccess: () => void,
          onFailure: (error: Error) => void
        ) => {
          onFailure(new Error('Unable to signup'));
        }
      );
    },

    isAuthenticated: jest.fn(),
    __mockisAuthenticatedSuccessCase() {
      currentUser.isAuthenticated.mockReturnValue(true);
    },
    __mockisAuthenticatedFailureCase() {
      currentUser.isAuthenticated.mockReturnValue(false);
    },

    logout: jest.fn(),
    __mockLogoutSuccessCase() {
      currentUser.logout.mockReturnValueOnce(true);
    },
    __mockLogoutFailureCase() {
      currentUser.logout.mockReturnValueOnce(false);
    },

    showLogin: jest.fn(),

    resetPassword: jest.fn(),
    __mockResetPasswordSuccessCase() {
      currentUser.resetPassword.mockImplementationOnce(
        (
          email: string,
          verificationCode: string,
          newPassword: string,
          successCallback?: () => void
        ) => {
          successCallback();
        }
      );
    },
    __mockResetPasswordFailureCase() {
      currentUser.resetPassword.mockImplementationOnce(
        (
          email: string,
          verificationCode: string,
          newPassword: string,
          successCallback?: () => void,
          failureCallback?: (error: Error) => void
        ) => {
          failureCallback(new Error('Unable to reset the password.'));
        }
      );
    },

    __resetCurrentUserMocks: () => (currentUser = mockCurrentUser())
  };
}

export let currentUser = mockCurrentUser();
