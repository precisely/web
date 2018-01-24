/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {call, take, put} from 'redux-saga/effects';
import {FETCH_DATA} from '../constants';
import {setData} from '../actions';
import {doGet} from '../utils/requests';

// Add sagas to make api calls and push the response in store here
export function* fetchData() {
    try {
        yield take(FETCH_DATA);
        const response: Object = yield call(doGet, 'conferenceYear/action/conferenceYearList');
        yield put(setData(response));
    } catch (error) {
        // Error handling code goes here
    }
}
