/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {fromJS, Map} from 'immutable';
import {SET_DATA} from '../constants';

const inititalState: Map<string, Object> = fromJS({});

// All the reducers to handle dispatched actions should be written here
export function demoReducer(state: Map<string, Object> = inititalState, action: {type: string, response: Object}) {
    switch (action.type) {
        case SET_DATA:
            return fromJS(action.response);
        default:
            return state;
    }
}
