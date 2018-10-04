
/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:51:51 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-03 14:21:08
 */

import { createError } from 'apollo-errors';

export const NotFoundError = createError('NotFoundError', {
  message: 'Not Found'
});

export const AccessDeniedError = createError('AccessDeniedError', {
  message: 'Access Denied'
});

export const AuthenticationError = createError('AuthenticationError', {
  message: 'Authentication Failure'
});
