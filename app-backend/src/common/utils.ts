/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
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

/**
 * Collects all objects with the same key value into lists, 
 *    with each list hashed by the key value
 * E.g.,
 * keyAllBy([
 *  {type: 'foo', a:1}, 
 *  {type: 'bar', a: 2}, 
 *  {type: 'bar', b: 3}
 * ], 'type')
 * => { 
 *   foo: [{type: 'foo', a: 1}],
 *   bar: [{type: 'bar', a: 2}, {type: 'bar', b: 3}]
 * }
 * @param objList
 * @param key 
 * 
 */
export function keyAllBy<T extends {[key: string]: any }, K extends string>( // tslint:disable-line no-any
  objList: T[], key: string
): { [key: string]: T[] } { 
  const result = {};
  objList.forEach(obj => {
    const keyValue = obj[key];
    result[keyValue] = (result[keyValue] || []).push(obj);
  });
  return result;
}