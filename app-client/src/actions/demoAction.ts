/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {SET_LENGTH} from 'src/containers/demo/actionTypes';

export function setLength(length: number) {
    return {
        type: SET_LENGTH,
        payload: length,
    };
}
