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
      currentUser.isAuthenticated.mockReturnValueOnce(true);
    },
    __mockisAuthenticatedFailureCase() {
      currentUser.isAuthenticated.mockReturnValueOnce(false);
    },

    logout: jest.fn(),
    __mockLogoutSuccessCase() {
      currentUser.logout.mockReturnValueOnce(true);
    },
    __mockLogoutFailureCase() {
      currentUser.logout.mockReturnValueOnce(false);
    },

    showLogin: jest.fn(),
    __mockshowLoginSuccessCase() {
      currentUser.showLogin.mockReturnValueOnce(true);
    },
    __mockshowLoginFailureCase() {
      currentUser.showLogin.mockReturnValueOnce(false);
    },

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
