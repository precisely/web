/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/* istanbul ignore next */
import {combineReducers, Reducer} from 'redux';
/* istanbul ignore next */
import {routerReducer} from 'react-router-redux';

// All the reducers should be combined here
/* istanbul ignore next */
export const rootReducer: Reducer<{}> = combineReducers({
    router: routerReducer,
});
