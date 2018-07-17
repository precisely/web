import {Context, InterpolationFunction} from 'smart-report';
import {parse, Variant as SVNVariant, Variant} from 'seqvarnomjs';
import { isNumber } from 'util';
import {VariantCall} from 'src/services/variant-call/models';
import {RSIdRegex} from 'src/common/variant-constraints';

/**
 * SmartReport function: 
 *  - Tests whether the variantDescription is present in the context
 *  - Updates the context with:
 *      __reportSVNVariantPatterns: [ "chr1:123A>T", ... ],
 *      __reportRSIds: []
 *    all variants encountered during processing 
 * 
 * @param context 
 * @param variantDescription 
 */
export const variant: InterpolationFunction = function(context: Context, variantDescription: string): boolean {
  const userVariants: SVNVariant[] = context.svnVariants;
  const userRSIds: { [key: string]: true } = context.rsIds;
  if (!context.__reportSVNVariantPatterns) {
    context.__reportSVNVariantPatterns = {};
    context.__reportRSIds = {};
  }
  const isRSId = RSIdRegex.test(variantDescription);

  if (isRSId) {
    const rsId = variantDescription.toLowerCase();
    context.__reportRSIds[rsId] = true;
    return !!userRSIds[rsId];
  } else { // variant id must be an svnVariant
    // memoize:
    let pattern: SVNVariant;
    try {
      if (!variantDescription) {
        throw new Error('Argument must be provided to variant function');
      }
      // get the cached pattern or parse the description and store it
      pattern = context.__reportSVNVariantPatterns[variantDescription]
                || (context.__reportSVNVariantPatterns[variantDescription] = parse(variantDescription));

      const result = userVariants && userVariants.some(uv => uv.matches(pattern));
      // console.log('variant(%s)=>%s in \ncontext: %s', variantDescription, result, JSON.stringify(context, null, 2));
      return !!result;
    } catch (e) {
      throw new Error(`Invalid argument to variant: ${variantDescription}`);
    }
  }
};

/**
 * Processes VariantCall objects, adding them to a SmartReport context
 * for use by other functions in this file. The variantCalls represent the
 * user's variants.
 * @param variantCalls
 * @param context
 */
export function addVariantCallsToContext(variantCalls: VariantCall[], context: Context): void {
  context.svnVariants = variantCalls.map(variantCallToSVNGenotype);
  context.rsIds = variantCalls.map(vc => vc.get('rsId')).filter(vc => vc);
}

export function variantCallToSVNGenotype(variantCall: VariantCall): Variant {
  const {refName, start, refBases, altBases, genotype} = variantCall.get();
  const cisAlleles = genotype.map(g => {
    if (g === 0) {
      return `[${start}=]`;
    } else if (isNumber(g)) {
      const altBase = altBases[g - 1];
      if (altBase && altBase !== '<NO_REF>') {
        return `[${start}${refBases}>${altBase}]`;
      }
    }
    throw new Error(`Unable process variant call genotype ${g} in ${variantCall.get()}`);
  }).filter(o => o);
  const svnVariant = `${refName}:g.${cisAlleles.join(';')}`;
  return parse(svnVariant);
}
