/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:47 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:50:47 
 */

import { ReducibleTagElement, Context, ReducerFunction, Attributes, removeTags } from 'smart-report';

// https://github.com/precisely/web/issues/202
// <AnalysisBox title="mek3" subtitle={} highlight={}>
//   <Analysis case={}>
//   </Analysis >
//   <AnalysisCase case={}>
//   </Analysis>
//

export const AnalysisBox: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  // console.log('analysisBox: %s', JSON.stringify(elt, null, 2), ctx);
  return [removeTags(elt.children, ({__name, case: caseValue }: Attributes) => {
    return __name === 'analysis' && !caseValue;
  }), ctx];
};
