import { SequenceVariant, parse } from 'src/common/svn';
import { Context } from 'smart-report';

import { isNumber } from 'util';
import {VariantCall} from 'src/services/variant-call/models';

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
    throw new Error(`Unable process variant call genotype ${g} in ${JSON.stringify(vc.get())}`);
  };
}
import { ensureProps } from 'src/common/type-tools';
import { refToNCBIAccession } from 'src/common/variant-tools';

export function variantCallToSVNGenotype(vc: VariantCall): SequenceVariant {
  const toAllele = alleleFromGenotypeFn(vc);
  
  const cisAlleles = vc.getValid('genotype').map(toAllele).filter(o => o);
  const { refName, refVersion } = ensureProps(vc.get(), 'refName', 'refVersion');
  const accession = refToNCBIAccession(refName, refVersion);
  const svnVariant = `${accession}:g.${cisAlleles.join(';')}`;
  return parse(svnVariant);
}

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
