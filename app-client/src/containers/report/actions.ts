/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as actionTypes from 'src/containers/report//actionTypes';

export const setLoadingState = () => {
    return {type: actionTypes.SET_LOADING_STATE};
};
