import { isNumber } from 'util';

import { normalizeReferenceName, VariantIndex } from 'src/common/variant-tools';
import { SequenceVariant } from 'src/common/svn';
import { Context } from 'smart-report';

/**
 * Extracts variantIndexes from the 
 * 
 * @param variantPatterns 
 */
export function extractVariantIndexes(context: Context) {
  // convert the SVNVariants to RefIndex, which will be used to query for VariantCalls for each user:
  const variantPatterns: { [key: string]: SequenceVariant } = context.__reportSVNVariantPatterns;
  const variantIndexes: VariantIndex[] = [];
  // add unique refIndexes
  for (const svnVariantName in variantPatterns) {
    if (variantPatterns.hasOwnProperty(svnVariantName)) {
      const svnVariant = variantPatterns[svnVariantName];
      for (const refIndex of svnVariantToVariantIndexes(svnVariant)) { 
        if (variantIndexes.findIndex(rri => refIndexEquals(rri, refIndex)) === -1) {
          variantIndexes.push(refIndex);
        }
      }
    }
  }
  return variantIndexes;
}

function refIndexEquals(ri1: VariantIndex, ri2: VariantIndex): boolean {
  return (
    ri1.refName === ri2.refName && 
    ri1.start === ri2.start &&
    ri1.refVersion === ri2.refVersion
  );
}

function positionsFromSVNVariant(svnVariant: SequenceVariant): number[] {
  return svnVariant.listSimpleVariants().map(sv => {
    if (isNumber(sv.pos)) {
      return sv.pos;
    } else {
      throw new Error(`Unable to process variant: ${sv.toString()}`);
    }
  });
}

function svnVariantToVariantIndexes(svnVariant: SequenceVariant): VariantIndex[] {
  const [refName, refVersion] = normalizeReferenceName(svnVariant.ac);
  const positions = positionsFromSVNVariant(svnVariant);
  return positions.map(pos => ({ refName, refVersion, start: pos }));
}
