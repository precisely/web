import Auth0Lock from 'auth0-lock';
import { Auth0UserProfile, Auth0Error } from 'auth0-js';

export class AuthUser {
  lock: Auth0LockStatic;

  constructor() {
    this.lock = new Auth0Lock(
        process.env.REACT_APP_AUTH0_CLIENT_ID, 
        process.env.REACT_APP_AUTH0_TENANT);

    this.lock.on('authenticated', this.onAuthentication);     
    
  }

  onAuthentication = () => (authResult: AuthResult) {
    this.lock.getUserInfo(authResult.accessToken, (error: Auth0Error, profile: Auth0UserProfile) => {
      if (error) {
        return;
      } 
      this.setAuthStorage(
        authResult.accessToken,
        (new Date().getMilliseconds() + authResult.expiresIn * 1000).toString(),
        JSON.stringify(profile),
        JSON.stringify(authResult)
      );
    });
  }

  logout = () => {
    this.setAuthStorage();
  }

  setAuthStorage = (
      accessToken: string = '', 
      expiresAt: string = '', 
      profile: string = '', 
      authResult: string = '') => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('profile', profile);
    localStorage.setItem('authResult', authResult);
  }

  isAuthenticated = () => {
    let expiresAt = new Date(localStorage.getItem('expiresAt'));
    let accessToken = localStorage.getItem('accessToken');

    return accessToken && expiresAt > new Date();
  }

  showLogin = () => {
    this.lock.show();
  }
}
