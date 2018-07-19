//
// The Personalizer takes a report and
//
import {Report} from 'src/services/report/models';
import {VariantCall} from 'src/services/variant-call/models';
import {Reducer, ReducibleElement, ReducedElement, Context} from 'smart-report/lib';
import { components, functions } from 'src/services/report/services/personalizer/reducers';
import {addVariantCallsToContext} from 'src/services/report/services/personalizer/reducers/functions';

export const PreciselyReducer = new Reducer({
  components: components,
  functions: functions
});

export class Personalizer {
  constructor(public readonly report: Report, public readonly userId: string) {
  }

  async personalize(): Promise<ReducedElement[]> {
    const parsedContent: ReducibleElement[] = JSON.parse(this.report.get('parsedContent'));
    const context: Context = {};
    const variantIndexes = this.report.get('variantCallIndexes');
    const variantCalls = await VariantCall.forUser(this.userId, variantIndexes);
    addVariantCallsToContext(variantCalls, context);

    return PreciselyReducer.reduce(parsedContent, context);
  }
}