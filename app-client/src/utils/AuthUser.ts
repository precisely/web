import Auth0Lock from 'auth0-lock';
import { Auth0UserProfile, Auth0Error } from 'auth0-js';
import { authLockButtonBackground } from 'src/constants/styleGuide';
const logo = require('src/assets/logo.png');
export class AuthUser {
  lock: Auth0LockStatic;
  auth0Options = {
    theme: {
      logo: logo,
      primaryColor: authLockButtonBackground
    },
    languageDictionary: {
      title: 'Precise.ly'
    },
    auth: {
      redirectUrl: process.env.REACT_APP_CALLBACK_URL,
      responseType: 'token id_token',
      params: {
        scope: 'openid profile'
      }
    }
  };

  constructor() {
    this.lock = new Auth0Lock(
      process.env.REACT_APP_AUTH0_CLIENT_ID,
      process.env.REACT_APP_AUTH0_TENANT,
      this.auth0Options
    );

    this.lock.on('authenticated', this.onAuthentication);
    this.lock.on('authorization_error', (error: Error) => {
      // TODO - toaster needs to be added
      // tslint:disable-next-line
      console.log('something went wrong', error.message);
    });
  }

  onAuthentication = (authResult: AuthResult) => {
    this.lock.getUserInfo(
      authResult.accessToken,
      (error: Auth0Error, profile: Auth0UserProfile) => {
        if (error) {
          return;
        }
        this.setAuthStorage(
          authResult.accessToken,
          (new Date().getTime() + authResult.expiresIn * 1000).toString(),
          JSON.stringify(profile),
          JSON.stringify(authResult)
        );
      }
    );
  }

  logout = () => {
    this.setAuthStorage();
    window.location.href = '/';
  }

  setAuthStorage = (
    accessToken: string = '',
    expiresAt: string = '',
    profile: string = '',
    authResult: string = ''
  ) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('profile', profile);
    localStorage.setItem('authResult', authResult);
  }

  isAuthenticated = () => {
    let expiresAt = Number(localStorage.getItem('expiresAt'));
    let accessToken: string = localStorage.getItem('accessToken');

    return (
      accessToken &&
      accessToken.length > 0 &&
      expiresAt > 0 &&
      expiresAt > new Date().getTime()
    );
  }

  showLogin = () => {
    this.lock.show();
  }
}
