/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {createSelector} from 'reselect';

const selectDataDomain = (state: {data: number}): number => state.data;

export const getLength: Function = () => createSelector(
    selectDataDomain,
    (data: number) => Number.isInteger(data) ? data : 0
);
