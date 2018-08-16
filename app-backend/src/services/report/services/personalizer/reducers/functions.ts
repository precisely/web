/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:41 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:50:41 
 */

import {Context, InterpolationFunction} from 'smart-report';
import {parse, Variant as SVNVariant, Variant} from 'seqvarnomjs';
import { isNumber } from 'util';
import {VariantCall} from 'src/services/variant-call/models';
import { ensureProps } from 'src/common/type-tools';

/**
 * SmartReport function: 
 *  - Tests whether the variantDescription is present in the context
 *  - Updates the context with:
 *      __reportSVNVariantPatterns: [ "chr1.37p13:123A>T", ... ],
 *      __reportRSIds: []
 *    all variants encountered during processing 
 * 
 * @param context 
 * @param variantDescription 
 */
export const variantCall: InterpolationFunction = function(context: Context, variantDescription: string): boolean {
  const userVariants: SVNVariant[] = context.svnVariants;
  if (!context.__reportSVNVariantPatterns) {
    context.__reportSVNVariantPatterns = {};
  }
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
    return !!result;
  } catch (e) {
    throw new Error(`Invalid argument to variant: ${variantDescription}`);
  }
};

/**
 * Processes VariantCall objects, adding them to a SmartReport context
 * for use by other functions in this file. The variantCalls represent the
 * user's variants.
 * @param variantCalls
 * @param context
 */
export function addVariantCallsToContext(vcs: VariantCall[], context: Context): void {
  context.svnVariants = vcs.map(variantCallToSVNGenotype);
}

function alleleFromGenotypeFn(vc: VariantCall) {
  const {start, refBases, altBases} = vc.get();
  return (g: number): string => {
    if (g === 0) {
      return `[${start}=]`;
    } else if (isNumber(g) && altBases) {
      const altBase = altBases[g - 1];
      if (altBase && altBase !== '<NO_REF>') {
        return `[${start}${refBases}>${altBase}]`;
      }
    }
    throw new Error(`Unable process variant call genotype ${g} in ${vc.get()}`);
  };
}

export function variantCallToSVNGenotype(vc: VariantCall): Variant {
  const toAllele = alleleFromGenotypeFn(vc);
  
  const cisAlleles = vc.getValid('genotype').map(toAllele).filter(o => o);
  const { refName, refVersion } = ensureProps(vc.get(), 'refName', 'refVersion');
  const svnVariant = `${refName}.${refVersion}:g.${cisAlleles.join(';')}`;
  return parse(svnVariant);
}
