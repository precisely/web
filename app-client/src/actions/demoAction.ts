/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {SET_DATA, FETCH_DATA} from '../constants';

export function fetchData() {
    return {
        type: FETCH_DATA
    };
}

export function setData(response: Object = {}) {
    return {
        type: SET_DATA,
        response,
    };
}
