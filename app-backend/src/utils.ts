/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

/**
 * Extends one object with the key/values of the second, returning
 * an appropriate combined type
 *
 * @export
 * @template T
 * @template U
 * @param {T} first
 * @param {U} second
 * @returns {(T & U)}
 */
export function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U> first;
  if (second) {
    Object.keys(second).forEach(key => {
      first[key] = second[key];
    });
  }

  return result;
}
