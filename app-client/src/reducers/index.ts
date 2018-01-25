/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {combineReducers, Reducer} from 'redux';
import {demoReducer} from 'src/reducers/demoReducer';

// All the reducers should be combined here
export const rootReducer: Reducer<{}> = combineReducers({
    data: demoReducer
});
