/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {combineReducers, Reducer} from 'redux';
import {routerReducer} from 'react-router-redux';

// All the reducers should be combined here
export const rootReducer: Reducer<{}> = combineReducers({
    router: routerReducer,
});
