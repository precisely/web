/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:47 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-09-25 08:54:49
 */

import { ReducibleTagElement, Context, ReducerFunction, Attributes, removeTags } from 'smart-report';
import { isString } from 'util';

// https://github.com/precisely/web/issues/202
// mode = first | all  (first is default)
// <AnalysisPanel title="mek3" mode="first">  
//   <Analysis  name="this" case={}>
//   </Analysis >
//   <AnalysisCase case={}>
//   </Analysis>
//

export const AnalysisPanel: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  const mode: string = isString(ctx.mode) ? ctx.mode.toLowerCase() : 'first';
  let foundMatch = false;
  // set the status of the AnalysisPanel
  const userSampleStatus = elt.attrs.status = ctx.__userSampleRequirements.status;
  elt.attrs.userSampleStatus = userSampleStatus;
  if (userSampleStatus === 'ready') {
    return [removeTags(elt.children, ({__name, case: caseValue }: Attributes) => {
      // remove all analysis tags (foundMatch or if match has been found) 
      const remove = __name === 'analysis' && (!caseValue || foundMatch);
      
      // only set foundMatch tag when mode === first
      if (!remove && mode === 'first') {
        foundMatch = true;
      }

      return remove;
    }), ctx];
  } else {
    return [[], ctx];
  }
};
