/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

const storeLastPageBeforeLoginAt = 'lastPageBeforeLogin';
export const utils = {

  isEmpty: function(object: Object) {
    return (!object || !Object.keys(object).length);
  },

  getEnvironment: function() {
    return process.env.NODE_ENV || '';
  },

  setLastPageBeforeLogin: function(path: string | null) {
    if (path) {
      localStorage.setItem(storeLastPageBeforeLoginAt, path);
    }
    localStorage.removeItem(storeLastPageBeforeLoginAt);
  },
  setAuthStorage: function (
      accessToken: string = '', 
      expiresAt: string = '', 
      profile: string = '', 
      authResult: string = '') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('profile', profile);
    localStorage.setItem('authResult', authResult);
  },
  getLastPageBeforeLogin: function() {
    const lastPage = localStorage.getItem(storeLastPageBeforeLoginAt);
    return lastPage ? lastPage : '/';
  }

};
