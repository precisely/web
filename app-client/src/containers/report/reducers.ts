/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {fromJS, Map} from 'immutable';
import {SET_LOADING_STATE} from 'src/containers/report/actionTypes';

export const inititalState = fromJS({isLoading: false});

export function reportReducer(
        state:  Map<string, Object> = inititalState,
        action: {type: string, payload?: string}
    ):  Map<string, Object> {
    switch (action.type) {

        case SET_LOADING_STATE:
            return state.set('isLoading', true);

        default:
            return state;
    }
};
