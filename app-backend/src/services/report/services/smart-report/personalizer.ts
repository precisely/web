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
import { keyAllBy } from 'src/common/utils';
import { UserSample } from 'src/services/user-sample/models';
import { 
  UserSampleRequirement, UserSampleStatus 
} from 'src/services/user-sample/external';

export const PreciselyReducer = new Reducer({
  components: components,
  functions: functions
});

export class Personalization {
  public status?: string;
  public elements: ReducedElement[];
  constructor({status, elements}: {status?: string, elements: ReducedElement[]}) {
    this.status = status;
    this.elements = elements;
  }
}

export class Personalizer {
  constructor(public readonly report: Report, public readonly userId: string) {}

  async personalize(): Promise<Personalization> {
    const elements: ReducibleElement[] = this.report.getValid('publishedElements'); 
    const requirements = await this.calculateRequirements();
    const context: Context = { personalize: requirements.status === 'ready' };
    
    if (requirements.status === 'ready') {
      await this.addVariantCalls(context);
    }
    
    return new Personalization({
      status: requirements.status,
      elements: PreciselyReducer.reduce(elements, context)
    });
  }

  async addVariantCalls(context: Context) {
    const variantIndexes = this.report.getValid('variantIndexes');
    const variantCalls = await VariantCall.forUser(this.userId, variantIndexes);
    addVariantCallsToContext(variantCalls, context);
  }

  async calculateRequirements(): Promise<{
    satisfied: { [key: string]: UserSampleRequirement[] },
    unsatisfied: { [key: string]: UserSampleRequirement[] }
    status: UserSampleStatus | undefined
  }> {
    const userSampleRequirements = this.report.get('userSampleRequirements') || [];
    const [satisfied, unsatisfied] = await UserSample.resolveRequirements(
      this.userId, 
      userSampleRequirements
    );

    let status;
    if (unsatisfied && unsatisfied.length > 0) {
      status = undefined;
    } else if (satisfied && satisfied.length > 0) {
      const notReadyIndex = satisfied.findIndex(uss => uss.status !== 'ready');
      status = notReadyIndex === -1 ? UserSampleStatus.ready : satisfied[notReadyIndex].status;
    } else {
      status = UserSampleStatus.ready;
    }

    return {
      satisfied: keyAllBy(satisfied, 'type'),
      unsatisfied: keyAllBy(unsatisfied, 'type'),
      status
    };
  }
}
