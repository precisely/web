import { currentUser } from '../../constants/currentUser';

function mockAuthUser() {
  return {
    onAuthentication: jest.fn(),
    __mockOnAuthenticationSuccessCase() {
      authUser.onAuthentication.mockImplementationOnce(
        (authResult: AuthResult, onSuccess: () => void) => {
          onSuccess();
        }
      );
    },
    __mockOnAuthenticationFailureCase() {
      authUser.onAuthentication.mockImplementationOnce(
        (
          authResult: AuthResult,
          onSuccess: () => void,
          onFailure: (error: Error) => void
        ) => {
          onFailure(new Error('Unable to login'));
        }
      );
    },

    isAuthenticated: jest.fn(),
    __mockisAuthenticatedSuccessCase() {
      authUser.isAuthenticated.mockReturnValueOnce(true);
    },
    __mockisAuthenticatedFailureCase() {
      authUser.isAuthenticated.mockReturnValueOnce(false);
    },

    logout: jest.fn(),
    __mockLogoutSuccessCase() {
      authUser.logout.mockReturnValueOnce(true);
    },
    __mockLogoutFailureCase() {
      authUser.logout.mockReturnValueOnce(false);
    },

    setAuthStorage: jest.fn(),
    __mockSetAuthStorageSuccessCase() {
      authUser.setAuthStorage.mockReturnValueOnce(true)
    },
    __mockSetAuthStorageFailureCase() {
      authUser.setAuthStorage.mockReturnValueOnce(false);
    },
    __resetAuthUserMocks: () => (authUser = mockAuthUser())
  };
}

export let authUser = mockAuthUser();
