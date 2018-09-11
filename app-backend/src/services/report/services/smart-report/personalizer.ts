/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report} from 'src/services/report/models';
import {VariantCall} from 'src/services/variant-call/models';
import {Reducer, ReducibleElement, ReducedElement, Context} from 'smart-report';
import * as components from './components';
import * as functions from './data-types/functions';
import { addVariantCallsToContext } from './data-types/variant-call/helpers';

export const PreciselyReducer = new Reducer({
  components: components,
  functions: functions
});

export class Personalizer {
  constructor(public readonly report: Report, public readonly userId: string) {
  }

  async personalize(): Promise<ReducedElement[]> {
    const elements: ReducibleElement[] = this.report.getValid('publishedElements'); 
    const context: Context = {};
    const variantIndexes = this.report.getValid('variantIndexes');
    const variantCalls = await VariantCall.forUser(this.userId, variantIndexes);
    addVariantCallsToContext(variantCalls, context);

    return PreciselyReducer.reduce(elements, context);
  }
}
