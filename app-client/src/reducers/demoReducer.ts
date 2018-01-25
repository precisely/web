/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {SET_LENGTH} from 'src/containers/demo/actionTypes';

const inititalState: number = 10;

export function demoReducer(state: number = inititalState, action: {type: string, payload: number}): number {
    switch (action.type) {
        case SET_LENGTH:
            return action.payload;
        default:
            return state;
    }
}
