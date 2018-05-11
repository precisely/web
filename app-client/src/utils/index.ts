/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
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

  getLastPageBeforeLogin: function() {
    return localStorage.getItem('lastPageBeforeLogin');
  }

};
