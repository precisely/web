/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {createHttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';

const createMockedNetworkFetch = require('apollo-mocknetworkinterface');

export function getApolloClient<Response>(createResponse: () => Response) {
  const mockedNetworkFetch = createMockedNetworkFetch(createResponse, {timeout: 1});

  return new ApolloClient({
    link: createHttpLink({uri: 'http://localhost:3000', fetch: mockedNetworkFetch}),
    cache: new InMemoryCache({addTypename: false}),
  });
}

export const mockedHistory: {
  push: jest.Mock<void>,
  goBack: jest.Mock<void>,
  replace: jest.Mock<void>
} = {
  push: jest.fn<void>(),
  goBack: jest.fn<void>(),
  replace: jest.fn<void>()
};
