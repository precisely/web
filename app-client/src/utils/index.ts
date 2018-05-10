/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import { currentUser } from '../constants/currentUser';

export const utils = {

  isEmpty: function(object: Object): boolean {
    return (!object || !Object.keys(object).length);
  },

  getEnvironment: function(): string {
    return process.env.NODE_ENV || '';
  },

  currentUser: currentUser

};
