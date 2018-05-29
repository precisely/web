/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
import { utils } from '.';

export class User {
  
  logout = () => {
    utils.setAuthStorage();
    window.location.href = '/';
  }

  isAuthenticated = () => {
    let expiresAt = Number(localStorage.getItem('expiresAt'));
    let accessToken: string = localStorage.getItem('accessToken');

    if (accessToken && accessToken.length > 0 && expiresAt > 0 && expiresAt > new Date().getTime()) {
      return accessToken;
    }
    return false;
  }
}
