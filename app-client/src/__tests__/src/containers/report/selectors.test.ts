/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {fromJS} from 'immutable';
import {getReportFromStore, isLoading} from 'src/containers/report/selectors';

describe('Selectors tests', () => {

  it('should select the report data from the store root', () => {
    expect(getReportFromStore({report: fromJS({aKey: 'dummyData'}), demo: 'Yet another demo data'}))
        .toEqual({aKey: 'dummyData'});
  });

  it('should get the loading state value.', () => {
    getReportFromStore = jest.fn().mockReturnValue({isLoading: true});
    expect((isLoading())(fromJS({isLoading: true}))).toBe(true);
  });
});
