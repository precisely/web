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
import { UserSample, UserSampleAttributes, UserSampleStaticMethods } from 'src/services/user-sample/models';
import { keyAllBy } from 'src/common/utils';
import { UserSampleRequirement, UserSampleRequirementStatus, UserSampleStatus } from 'src/services/user-sample/external';

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
    
    await Promise.all([
      this.addVariantCalls(context),
      this.addSampleRequirements(context)
    ]);
    
    return PreciselyReducer.reduce(elements, context);
  }

  async addVariantCalls(context: Context) {
    const variantIndexes = this.report.getValid('variantIndexes');
    const variantCalls = await VariantCall.forUser(this.userId, variantIndexes);
    addVariantCallsToContext(variantCalls, context);
  }

  /**
   * 
   * @param context 
   */
  async addSampleRequirements(context: Context) {
    const userSampleRequirements = this.report.get('userSampleRequirements') || [];
    const [satisfied, unsatisfied] = await UserSample.resolveRequirements(
      this.userId, 
      userSampleRequirements
    );
    const status = this.calculateUserSampleStatus(satisfied, unsatisfied);
    context.__userSampleRequirements = {
      satisfied: keyAllBy(satisfied, 'type'),
      unsatisfied: keyAllBy(unsatisfied, 'type'),
      status
    };
  }

  calculateUserSampleStatus(
    satisfied: UserSampleRequirementStatus[], unsatisfied: UserSampleRequirement[]
  ): UserSampleStatus | undefined {
    if (unsatisfied && unsatisfied.length > 0) {
      return undefined;
    } else if (satisfied && satisfied.length > 0) {
      const notReadyIndex = satisfied.findIndex(usa => usa.status !== 'ready');
      return notReadyIndex === -1 ? UserSampleStatus.ready : satisfied[notReadyIndex].status;
    } else {
      return UserSampleStatus.ready;
    }
  }
}
