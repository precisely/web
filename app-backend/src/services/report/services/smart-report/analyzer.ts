import { ReducibleElement, Context, Reducer } from 'smart-report';
import { VariantIndex } from 'src/common/variant-tools';
import { variantCall } from 'src/services/report/services/smart-report/data-types/functions';
import { extractVariantIndexes } from 'src/services/report/services/smart-report/data-types/variant-call';

export class Analyzer {
  /**
   * Runs the reducer in analysisMode to discover data types mentioned in the report
   * 
   * @param elements 
   */
  static extractRequirements(
    elements: ReducibleElement[]
  ): { variantIndexes: VariantIndex[] } {
    const context: Context = {};
    const reducer = new Reducer({ 
      functions: { variantCall },   
      analysisMode: true        // turn on analysisMode
                                // functions at every code branch are evaluated
    }); 
    reducer.reduce(elements, context);
    const variantIndexes = extractVariantIndexes(context);
    
    const result = { variantIndexes: variantIndexes };
    return result;
  }
}
