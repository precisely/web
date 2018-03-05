/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/* istanbul ignore next */
import logger from 'redux-logger';
/* istanbul ignore next */
import {createStore, applyMiddleware} from 'redux';
/* istanbul ignore next */
import {rootReducer} from 'src/reducers';

/* istanbul ignore next */
const middlewares = [
    logger,
];

/**
 * store configurations:
 * rootReducer: Reducer<{}>
 * config for redux-devtools-extension
 * saga and logger middleware
 */
/* istanbul ignore next */
export const store = createStore(
    rootReducer,
    typeof window !== 'undefined' && window[`__REDUX_DEVTOOLS_EXTENSION__`] && window[`__REDUX_DEVTOOLS_EXTENSION__`](),
    applyMiddleware(...middlewares)
);
