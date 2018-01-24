/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import logger from 'redux-logger';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from './reducers';

export const sagaMiddleware: SagaMiddleware<{}> = createSagaMiddleware();

const middlewares = [
    sagaMiddleware,
    logger,
];

/**
 * store configurations:
 * rootReducer: Reducer<{}>
 * config for redux-devtools-extension
 * saga and logger middleware
 */
export const store = createStore(
    rootReducer,
    typeof window !== 'undefined' && window[`__REDUX_DEVTOOLS_EXTENSION__`] && window[`__REDUX_DEVTOOLS_EXTENSION__`](),
    applyMiddleware(...middlewares)
);
