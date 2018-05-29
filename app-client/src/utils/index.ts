/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export const utils = {

  isEmpty: function(object: Object) {
    return (!object || !Object.keys(object).length);
  },

  getEnvironment: function() {
    return process.env.NODE_ENV || '';
  },

  setLastPageBeforeLogin: function(path: string) {
    localStorage.setItem('lastPageBeforeLogin', path);
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
    const lastPage = localStorage.getItem('lastPageBeforeLogin');
    return lastPage ? lastPage : process.env.REACT_APP_URL;
  }

};
