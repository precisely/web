/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {SET_LENGTH} from '../constants';

const inititalState: number = 10;

// All the reducers to handle dispatched actions should be written here
export function demoReducer(state: number = inititalState, action: {type: string, payload: number}): number {
    switch (action.type) {
        case SET_LENGTH:
            return action.payload;
        default:
            return state;
    }
}
