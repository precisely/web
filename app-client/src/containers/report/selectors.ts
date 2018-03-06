/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {createSelector} from 'reselect';

const selectReportsDomain = (state: Map<string, {isLoading: boolean}>) => state[`report`].toJS();

export const isLoading: Function = () => createSelector(
    selectReportsDomain, (data: {isLoading: boolean}) => data.isLoading
);
