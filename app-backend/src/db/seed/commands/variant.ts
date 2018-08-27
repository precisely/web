import { VariantCall } from 'src/services/variant-call';
import { VariantCallAttributes, Zygosity } from 'src/services/models';
import { isString } from 'util';
import { get as dig } from 'lodash';

export async function variantCommand(userId?: string, variantDescription?: string) {
  if (!userId || !variantDescription) {
    console.log(`usage: yarn sls seed:variant {userId} {variant e.g., mthfr.c677t:het`);
    process.exit(1);
    return;
  }

  const [geneVariant, genotype] = variantDescription.split(':');

  const variantAttrs = dig(GeneVariants, geneVariant);
  if (!variantAttrs) {
    console.log('No variant %s - allowed values are: %s', geneVariant, listGeneVariants().join(', '));
    process.exit(1);
    return;
  } 
  await makeVariant(userId, variantAttrs, genotype);
}

function listGeneVariants() {
  return [].concat.apply([], Object.keys(GeneVariants).map(
    gene => Object.keys(GeneVariants[gene]).map(
      variant => `${gene}.${variant}`
    )
  ));
}
function vcattrs(
  chr: number | string, 
  start: number, 
  refBases: string, 
  altBases: string[]
): VariantCallAttributes {
  const refName = chr === 'MT' ? 'MT' : `chr${chr}`;
  
  return { refName, start, refBases, altBases, refVersion: '37p13' };
}

export const GeneVariants = {
  mthfr: {
    c677t: vcattrs(1, 11856378, 'G', ['A']),
    a1298c: vcattrs(1, 11854476, 'T', ['G'])
  }
};

export function makeVariant(
  userId: string, 
  attrs: VariantCallAttributes = {},
  genotype?: string
) {
  const trueGenotype = isString(genotype) 
    ? { het: [0, 1], hom: [1, 1], wt: [0, 0] }[genotype] 
    : genotype || attrs.genotype;
  const variant = new VariantCall({
    ...attrs, userId, 
    genotype: trueGenotype, 
    sampleId: `${userId}-23andme-seed-sample`,
    sampleType: '23andme', 
    seed: true});
  return variant.saveAsync();
}

export async function clearVariants(userId: string) {
  const {Items} = await VariantCall.query(userId).execAsync();
  await Promise.all(Items.map(vc => vc.destroyAsync()));
}
