/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import registerServiceWorker from './registerServiceWorker';
import {rootSaga} from './sagas';
import {TestMainPage} from './components/TestMainPage';
import {Demo} from './containers/Demo';
import {sagaMiddleware, store} from './store';

/**
 * Initiate all sagas
 */
sagaMiddleware.run(rootSaga);

initReactFastclick();

const client = new ApolloClient({
    link: new HttpLink({uri: 'http://localhost:4000/api'}),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path="/" component={TestMainPage} />
                        <Route path="/demo" component={Demo} />
                    </Switch>
                </BrowserRouter>
            </div>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
