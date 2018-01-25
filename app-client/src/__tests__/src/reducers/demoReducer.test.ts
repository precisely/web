/*
 * Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {SET_LENGTH} from 'src/containers/demo/actionTypes';
import {demoReducer, inititalState} from 'src/reducers/demoReducer';

describe('Tests for demoReducer', (): void => {
    const getActionData = (payload: number): {type: string, payload: number} => {
        return {
            type: SET_LENGTH,
            payload,
        };
    };

    it('should set the list length in the store.', (): void => {
        const result: number = demoReducer(inititalState, getActionData(100));
        expect(result).toEqual(100);
    });

    it('should set the default or current length value in the store when the action type is invalid', (): void => {
        expect(demoReducer(undefined, {type: 'TEST_ACTION'})).toEqual(10);
    });
});
