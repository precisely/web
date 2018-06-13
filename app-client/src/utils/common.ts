/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export function isEmpty(object: Object) {
  return (!object || !Object.keys(object).length);
}

export function getEnvironment() {
  return process.env.NODE_ENV || '';
}
