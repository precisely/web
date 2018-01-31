/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import {Provider} from 'react-redux';
import {StyleRoot} from 'radium';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {store} from 'src/store';
import {LoginAndSignup} from 'src/containers/user/LoginAndSignup';

initReactFastclick();

const client = new ApolloClient({
    link: new HttpLink({uri: process.env.REACT_APP_GRAPHQL_ENDPOINT}),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <StyleRoot>
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path="/login" component={LoginAndSignup} />
                        <Route exact={true} path="/signup" component={LoginAndSignup} />
                    </Switch>
                </BrowserRouter>
            </StyleRoot>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
