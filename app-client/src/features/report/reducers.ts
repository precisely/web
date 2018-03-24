/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {fromJS, Map} from 'immutable';
import {SET_LOADING_STATE, SET_REPORT_DATA} from 'src/features/report/actionTypes';
import {GenericAction} from 'src/interfaces';
import {ReportData} from 'src/features/report/interfaces';

export const initialState = fromJS({
  isLoading: false,
  data: {},
});

export function reportReducer(
    state:  Map<string, Object> = initialState,
    action: GenericAction<ReportData>
): Map<string, Object> {
  switch (action.type) {

    case SET_LOADING_STATE:
      return state.set('isLoading', true);

    case SET_REPORT_DATA:
      return state.set('data', action.payload).set('isLoading', false);

    default:
      return state;
  }
}
