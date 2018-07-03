import * as _ from 'lodash';
import * as Auth0 from 'auth0-js';


export const LS_AUTH_ACCESS_TOKEN = 'auth-access-token';
export const LS_AUTH_ID_TOKEN = 'auth-id-token';
export const LS_AUTH_EXPIRES_IN = 'auth-token-expires-at';
export const LS_AUTH_USER = 'auth-user';


export function logout() {
  removeAuthentication();
  window.location.href = '/';
}


export function isAuthenticated() {

  const expiresAt = Number(localStorage.getItem(LS_AUTH_EXPIRES_IN));
  const accessToken: string = localStorage.getItem(LS_AUTH_ACCESS_TOKEN);

  if (accessToken &&
      accessToken.length > 0 &&
      expiresAt > 0 &&
      expiresAt > new Date().getTime()) {
    return accessToken;
  }

  return false;

}


export function saveAuthentication(authResult: Auth0.Auth0DecodedHash, user: object) {
  const expiresIn = (new Date().getTime() + authResult.expiresIn * 1000).toString();
  localStorage.setItem(LS_AUTH_ACCESS_TOKEN, authResult.accessToken);
  localStorage.setItem(LS_AUTH_ID_TOKEN, authResult.idToken);
  localStorage.setItem(LS_AUTH_EXPIRES_IN, expiresIn);
  localStorage.setItem(LS_AUTH_USER, JSON.stringify(user));
}


export function removeAuthentication() {
  const keys = [
    LS_AUTH_ACCESS_TOKEN,
    LS_AUTH_ID_TOKEN,
    LS_AUTH_EXPIRES_IN,
    LS_AUTH_USER
  ];
  for (const k of keys) {
    localStorage.removeItem(k);
  }
}


export function getUserName(): string {
  const user = JSON.parse(localStorage.getItem(LS_AUTH_USER));
  return _.get(user, ['name'], '');
}
