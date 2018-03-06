/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as actionTypes from 'src/containers/report/actionTypes';
import {GenericAction} from 'src/interfaces';
import {ReportList} from 'src/containers/report/interfaces';

export const setLoadingState = (): GenericAction => {
    return {type: actionTypes.SET_LOADING_STATE};
};

export const setReportData = (payload: ReportList): GenericAction<ReportList> => {
    return {type: actionTypes.SET_REPORT_DATA, payload};
};
