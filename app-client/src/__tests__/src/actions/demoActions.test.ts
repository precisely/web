/*
 * Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {setLength} from 'src/actions/demoAction';
import {SET_LENGTH} from 'src/containers/demo/actionTypes';

describe('Tests for the demoActions', (): void => {

    const expectedAction: {type: string, payload: number} = {
        type: SET_LENGTH,
        payload: 10,
    };

    it('should create an action to set the random list length.', (): void => {
        expect(setLength(10)).toEqual(expectedAction);
    });
});