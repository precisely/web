/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import { createError } from 'apollo-errors';

export const NotFoundError = createError('not_found', {
  message: 'Not Found'
});

export const AccessDeniedError = createError('access_denied', {
  message: 'Access Denied'
});

export const AuthenticationError = createError('authentication', {
  message: 'Authentication Required'
});
