/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {all} from 'redux-saga/effects';
import {fetchData} from './demoSagas';

// All the sagas should be combined here
export function* rootSaga() {
    yield all([
        fetchData(),
    ]);
}
