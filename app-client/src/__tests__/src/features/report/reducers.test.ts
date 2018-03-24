/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {Map, fromJS} from 'immutable';
import {ReportData} from 'src/features/common/report/interfaces';
import {SET_LOADING_STATE, SET_REPORT_DATA} from 'src/features/common/report/actionTypes';
import {GenericAction} from 'src/interfaces';
import {reportReducer, initialState} from 'src/features/common/report/reducers';
import {dummyData} from 'src/__tests__/src/features/report/testData';

const unroll = require('unroll');
unroll.use(it);

describe('Report reducers tests.', () => {

  const getActionData = (type: string, payload?: ReportData): GenericAction<ReportData> => {
    return {type, payload};
  };

  unroll('It should return the initial state when the state is #title', (
    done: () => void,
    args: {
      title: string,
      stateData: Map<string, Object>,
    }
  ) => {
    expect(reportReducer(args.stateData, {type: 'TEST_ACTION'})).toEqual(initialState);
    done();
  }, [ // tslint:disable-next-line
    ['title', 'stateData'],
    ['available but the action type is not matched.', initialState],
    ['not available.', undefined],
  ]);

  it('should set the isLoading to true when the type is SET_LOADING_STATE.', () => {
    expect(reportReducer(initialState, getActionData(SET_LOADING_STATE)))
        .toEqual(fromJS({data: {}, isLoading: true}));
  });

  unroll('It should set the #condition to the store when the type is #actionType', (
      done: () => void,
      args: {
        condition: string,
        actionType: string,
        actionPayload: ReportData,
        result: {data: ReportData, isLaoding: boolean}
      }
  ) => {
    expect(reportReducer(initialState, getActionData(args.actionType, args.actionPayload)).toJS())
        .toEqual(args.result);
    done();
  }, [ // tslint:disable-next-line
    ['condition', 'actionType', 'actionPayload', 'result'],
    ['loading state to true', SET_LOADING_STATE, null, {data: {}, isLoading: true}],
    ['report data', SET_REPORT_DATA, dummyData, {data: dummyData, isLoading: false}],
  ]);
});
