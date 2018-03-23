/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {match} from 'react-router';
import {Location, History} from 'history';

export const mockedLocation: Location = {
  pathname: 'demoPathName',
  search: 'demoSearchString',
  state: {},
  hash: 'dummyRouteHash',
};

export const mockedHistory: History = {
  length: 1,
  action: 'PUSH',
  location: mockedLocation,
  push: jest.fn<void>(),
  replace: jest.fn<void>(),
  go: jest.fn<void>(),
  goBack: jest.fn<void>(),
  goForward: jest.fn<void>(),
  block: jest.fn<void>(),
  listen: jest.fn<void>(),
  createHref: jest.fn<void>(),
};

export function mockedMatch<P = void>(params?: P): match<P> {
  return {
    params,
    isExact: true,
    path: 'lorem/ipsum',
    url: 'dummyUrl',
  };
}
