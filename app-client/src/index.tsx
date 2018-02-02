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
import Loadable from 'react-loadable';
import {Provider} from 'react-redux';
import {StyleRoot} from 'radium';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ToastContainer} from 'react-toastify';
import {store} from 'src/store';
import {LoadingPage} from 'src/containers/LoadingPage';

initReactFastclick();

const client = new ApolloClient({
    link: new HttpLink({uri: process.env.REACT_APP_GRAPHQL_ENDPOINT}),
    cache: new InMemoryCache(),
});

const LoadComponent = (componentName: string, path?: string) =>  {
    return Loadable({
        // tslint:disable-next-line
        loader: () => import('src/containers/' + (path || componentName)),
        // tslint:disable-next-line
        render(loaded: any, props: any) {
            // tslint:disable-next-line no-any
            const Component: React.ComponentClass<any> = loaded[`${componentName}`];

            return <Component {...props} />;
        },
        // tslint:disable-next-line
        loading() {
            return <LoadingPage />;
        }
    });
};

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <StyleRoot>
                <ToastContainer hideProgressBar />
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/login" component={LoadComponent('Login', 'user/Login')}/>
                        <Route exact path="/signup" component={LoadComponent('Signup', 'user/Signup')}/>
                    </Switch>
                </BrowserRouter>
            </StyleRoot>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
