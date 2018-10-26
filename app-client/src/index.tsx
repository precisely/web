/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import initializeReactFastclick = require('react-fastclick');
import {BrowserRouter} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ToastContainer} from 'react-toastify';
import {BasePage} from 'src/features/common/BasePage';
import * as Bluebird from 'bluebird';
import Radium from 'radium';


initializeReactFastclick();

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('auth-id-token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map((values: any) => {
      console.log(`Error: ${JSON.stringify(values)}`);
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink, errorLink, httpLink,
  ]),
  cache: new InMemoryCache(),
});

Bluebird.config({
  longStackTraces: true,
  warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Radium.StyleRoot>
      <ToastContainer hideProgressBar={true} />
      <BrowserRouter>
        <BasePage />
      </BrowserRouter>
    </Radium.StyleRoot>
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);
