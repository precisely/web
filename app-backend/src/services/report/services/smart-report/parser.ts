/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:20 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:50:20 
 */

import {Parser as SmartReportParser, markdownItEngine} from 'smart-report';
import * as functions from './data-types/functions';

export const Parser = new SmartReportParser({
  markdownEngine: markdownItEngine(),
  allowedTags: [
    'AnalysisPanel', 'Analysis', 
    'IndicatorPanel', 'Indicator',
    'GeneMap', 'Variant', 'PieChart', 
    'TopicBar'],
  allowedFunctions: Object.keys(functions)
});
