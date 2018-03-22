/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {createSelector, OutputSelector} from 'reselect';
import {ReportData} from 'src/containers/report/interfaces';

type Selector<T> = OutputSelector<Map<string, Object>, T, (res: boolean) => void>;

export const selectReportsDomain = (state: Map<string, {isLoading: boolean}>) => state[`report`].toJS();

export const isLoading = (): Selector<boolean> => createSelector(
  selectReportsDomain, (report: {isLoading: boolean}) => report.isLoading
);

export const getReportData = () => createSelector(
  selectReportsDomain, (report: {data: ReportData}) => report.data
);
