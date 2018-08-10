/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:51:51 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:51:51 
 */

type ErrorType = 'accessDenied' | 'unknown' | 'fileError';

export class TypedError extends Error {
  type?: ErrorType;
  constructor(message: string, type: ErrorType = 'unknown') {
    super(message);
    this.type = type;
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, actualProto); 
    } else { 
      (<any> this).__proto__ = actualProto; // tslint:disable-line no-any
    } 
  }
}
