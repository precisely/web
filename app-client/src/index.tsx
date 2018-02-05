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
import {AuthRoute} from 'src/components/AuthRoute';
import {isLoggedIn} from 'src/utils/cognito';

initReactFastclick();

const client = new ApolloClient({
    link: new HttpLink({uri: process.env.REACT_APP_GRAPHQL_ENDPOINT}),
    cache: new InMemoryCache(),
});

// tslint:disable
const LoadComponent = (componentName: string, path?: string) =>  {
    return Loadable({
        loader: () => import('src/containers/' + (path || componentName)),
        render(loaded: any, props: any) {
            const Component: React.ComponentClass<any> = loaded[`${componentName}`];

            return <Component {...props} />;
        },
        loading() {
            return <LoadingPage />;
        }
    });
};
// tslint:enable

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <StyleRoot>
                <ToastContainer hideProgressBar />
                <BrowserRouter>
                    <Switch>
                        <AuthRoute
                                onEnter={(): boolean => !isLoggedIn()}
                                redirectTo="/dashboard"
                                path="/"
                                exact
                                component={LoadComponent('Homepage', 'homepage/Homepage')}
                        />
                        <AuthRoute
                                onEnter={(): boolean => !isLoggedIn()}
                                redirectTo="/dashboard"
                                path="/login"
                                exact
                                component={LoadComponent('Login', 'user/Login')}
                        />
                        <AuthRoute
                                onEnter={(): boolean => !isLoggedIn()}
                                redirectTo="/dashboard"
                                path="/signup"
                                exact
                                component={LoadComponent('Signup', 'user/Signup')}
                        />
                        <AuthRoute
                                onEnter={(): boolean => isLoggedIn()}
                                redirectTo="/login"
                                path="/dashboard"
                                exact
                                component={LoadComponent('Dashboard', 'user/Dashboard')}
                        />
                        <AuthRoute
                                onEnter={(): boolean => !isLoggedIn()}
                                redirectTo="/dashboard"
                                path="/reset-password/:email"
                                exact
                                component={LoadComponent('ResetPassword', 'user/ResetPassword')}
                        />
                        <AuthRoute
                                onEnter={(): boolean => !isLoggedIn()}
                                redirectTo="/dashboard"
                                path="/forgot-password"
                                exact
                                component={LoadComponent('ForgotPassword', 'user/ForgotPassword')}
                        />
                        <Route path="*" component={LoadComponent('NotFound')} />
                    </Switch>
                </BrowserRouter>
            </StyleRoot>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
