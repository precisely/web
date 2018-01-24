/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {createSelector} from 'reselect';

// Add selectors to get data from redux-store
const selectDataDomain = (state: Map<string, Object>): Function => state[`data`].toJS();

export const getData: Function = () => createSelector(
    selectDataDomain,
    (data: Object) => Object.keys(data).length ? data[`instanceList`] : {}
);
