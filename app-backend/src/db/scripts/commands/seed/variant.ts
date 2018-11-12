import { VariantCall } from 'src/services/variant-call';
import { VariantCallAttributes } from 'src/services/models';
import { isString } from 'util';
import { get as dig } from 'lodash';

export async function variantCommand(userId?: string, variantDescription?: string) {
  if (!userId || !variantDescription) {
    console.log(`usage: yarn seed:variant --user {userId} --variant {variant e.g., mthfr.c677t:het`);
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
  },
  chrna5: {
    g1192a: vcattrs(15, 78882925, 'G', [ 'A' ]),
    a78573551g: vcattrs(15, 78865893, 'A', [ 'G' ]),
    a78581651t: vcattrs(15, 78873993, 'A', [ 'T' ])
  },
  chrna3: {
    c78606381t: vcattrs(15, 78898723, 'C', ['T']),
    c645t: vcattrs(15, 78894339, 'G', ['A'])
  },
  chrnb4: {
    c78631645t: vcattrs(15, 78923987, 'C', ['T']),
    g78635922t: vcattrs(15, 78928264, 'G', ['T']),
    a78638168g: vcattrs(15, 78930510, 'A', ['G'])
  },
  chrne: {
    g1074a: vcattrs(17, 4804902, 'G', ['A']),
    c865t: vcattrs(5, 142709986, 'C', ['T']),
  },
  clybl: {
    c775t: vcattrs(13, 100518634, 'C', ['T'])
  },
  crhr1: {
    a45815234g: vcattrs(17, 43892600, 'A', ['G']),
    g45825631a: vcattrs(17, 43902997, 'G', ['A'])
  },
  grik2: {
    a101518578g: vcattrs(6, 101966454, 'A', ['G']),
  },
  grik3: {
    t928g: vcattrs(1, 37325477, 'A', ['G']),
    c36983994t: vcattrs(1, 37449595, 'C', ['T'])
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
    sampleSource: '23andme', 
    seed: true
  });
  return variant.saveAsync();
}

export async function clearVariants(userId: string) {
  const {Items} = await VariantCall.query(userId).execAsync();
  await Promise.all(Items.map(vc => vc.destroyAsync()));
}
