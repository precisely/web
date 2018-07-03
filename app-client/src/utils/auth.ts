export const LS_AUTH_ACCESS_TOKEN = 'auth-access-token';
export const LS_AUTH_EXPIRES_IN = 'auth-token-expires-at';


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


// FIXME:
export function saveAuthentication(authResult: any, user: any) {
  const expiresIn = (new Date().getTime() + authResult.expiresIn * 1000).toString();
  localStorage.setItem(LS_AUTH_ACCESS_TOKEN, authResult.accessToken);
  localStorage.setItem(LS_AUTH_EXPIRES_IN, expiresIn);
}


export function removeAuthentication() {
  const keys = [
    LS_AUTH_ACCESS_TOKEN,
    LS_AUTH_EXPIRES_IN
  ];
  for (const k of keys) {
    localStorage.removeItem(k);
  }
}
