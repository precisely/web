/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {setLoadingState, setReportData} from 'src/features/common/report/actions';
import {SET_LOADING_STATE, SET_REPORT_DATA} from 'src/features/common/report/actionTypes';
import {dummyData} from 'src/__tests__/src/features/report/testData';

describe('Tests for the report actions', () => {
  it('should create an action to set loading state.', () => {
    expect(setLoadingState()).toEqual({type: SET_LOADING_STATE});
  });

  it('should create an action to set the report data.', () => {
    expect(setReportData(dummyData)).toEqual({type: SET_REPORT_DATA, payload: dummyData});
  });
});
