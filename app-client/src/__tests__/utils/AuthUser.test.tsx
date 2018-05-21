// jest.mock('src/utils/AuthUser');
import { authUser } from '../../utils/__mocks__/AuthUser';
import { currentUser } from 'src/constants/currentUser';

const unroll = require('unroll');
unroll.use(it);

describe('AuthUser tests', () => {
  const successCallback = jest.fn();
  const failureCallback = jest.fn();

  beforeEach(() => {
    successCallback.mockReset();
    failureCallback.mockReset();
  });

  it('It should return true is user is authenticated', () => {
    authUser.__mockisAuthenticatedSuccessCase();
    expect(authUser.isAuthenticated()).toBe(true);
  });

  it('It should return false is user is unauthenticated', () => {
    authUser.__mockisAuthenticatedFailureCase();
    expect(authUser.isAuthenticated()).toBe(false);
  });

  it('It should set the window location to base after logout ', () => {
    currentUser.logout();
    expect(window.location.href).toEqual('http://localhost/');
  });

  it('It should set authStorage after authentication',()=>{
    authUser.__mockSetAuthStorageSuccessCase();
    currentUser.onAuthentication({
      accessToken: 'dummyToken',
      expiresIn: 200,
      idToken: 'dummyAccountToken',
      idTokenPayload: null,
      state: null,
      tokenType: ''
    });
    expect(window.location.href).toEqual('http://localhost/');
  });
});
