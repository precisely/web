/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:41 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-17 14:45:40
 */

import {Context, InterpolationFunction} from 'smart-report';
import { SequenceVariant, parse } from 'src/common/svn';

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
  const userVariants: SequenceVariant[] = context.svnVariants;
  if (!context.__reportSVNVariantPatterns) {
    context.__reportSVNVariantPatterns = {};
  }
    // memoize:
  let pattern: SequenceVariant;
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
