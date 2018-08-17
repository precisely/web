/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from 'src/services/report/models';
import {VariantCall} from 'src/services/variant-call/models';
import {Reducer, ReducibleElement, ReducedElement, Context} from 'smart-report/lib';
import { components, functions } from './components';
import { addVariantCallsToContext } from './functions';

export const PreciselyReducer = new Reducer({
  components: components,
  functions: functions
});

export class Personalizer {
  constructor(public readonly report: Report, public readonly userId: string) {
  }

  async personalize(): Promise<ReducedElement[]> {
    const parsedContent: ReducibleElement[] = JSON.parse(this.report.getValid('parsedContent')); 
    const context: Context = {};
    const variantIndexes = this.report.getValid('variantIndexes');
    const variantCalls = await VariantCall.forUser(this.userId, variantIndexes);
    addVariantCallsToContext(variantCalls, context);

    return PreciselyReducer.reduce(parsedContent, context);
  }
}
