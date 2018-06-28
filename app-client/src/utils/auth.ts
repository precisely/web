/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export const ACCESS_TOKEN_KEY = 'accessToken';
export const EXPIRES_IN_KEY = 'tokenExpiresAt';

export function logout() {
  removeAuthToken();
  window.location.href = '/';
}

function removeAuthToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_IN_KEY);
}

export function isAuthenticated() {
  const expiresAt = Number(localStorage.getItem(EXPIRES_IN_KEY));
  const accessToken: string = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken && accessToken.length > 0 && expiresAt > 0 && expiresAt > new Date().getTime()) {
    return accessToken;
  }
  return false;
}

export function saveToken(accessToken: string, expiresIn: number) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(EXPIRES_IN_KEY, (new Date().getTime() + expiresIn * 1000).toString());
}
