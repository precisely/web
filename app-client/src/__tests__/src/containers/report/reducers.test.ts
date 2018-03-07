/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {Map, fromJS} from 'immutable';
import {ReportList} from 'src/containers/report/interfaces';
import {SET_LOADING_STATE, SET_REPORT_DATA} from 'src/containers/report/actionTypes';
import {GenericAction} from 'src/interfaces';
import {reportReducer, initialState} from 'src/containers/report/reducers';
import {dummyData} from 'src/__tests__/src/containers/report/testData';

const unroll = require('unroll');
unroll.use(it);

describe('Report reducers tests.', () => {

  const getActionData = (type: string, payload?: ReportList): GenericAction<ReportList> => {
    return {type, payload};
  };

  unroll('It should return the initial state when the state is #title', (
    done: () => void,
    args: {
      title: string,
      stateData: Map<string, Object>,
    }
  ): void => {
    expect(reportReducer(args.stateData, {type: 'TEST_ACTION'})).toEqual(initialState);
    done();
  }, [ // tslint:disable-next-line
    ['title', 'stateData'],
    ['available but the action type is not matched.', initialState],
    ['not available.', undefined],
  ]);

  it('should set the  when the type is SET_LOADING_STATE.', () => {
    expect(reportReducer(initialState, getActionData(SET_LOADING_STATE)))
        .toEqual(fromJS({data: {}, isLoading: true}));
  });

  unroll('It should set the #condition to the store when the type is #actionType', (
      done: () => void,
      args: {
        condition: string,
        actionType: string,
        actionPayload: ReportList,
        result: {data: ReportList, isLaoding: boolean}
      }
  ): void => {
    expect(reportReducer(initialState, getActionData(args.actionType, args.actionPayload)).toJS())
        .toEqual(args.result);
    done();
  }, [ // tslint:disable-next-line
    ['condition', 'actionType', 'actionPayload', 'result'],
    ['loading state to true', SET_LOADING_STATE, null, {data: {}, isLoading: true}],
    ['report data', SET_REPORT_DATA, dummyData, {data: dummyData, isLoading: false}],
  ]);
});
