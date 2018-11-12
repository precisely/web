import {map, flatMap} from 'lodash';
const random = require('random');

import { GeneVariants, makeVariant } from './variant';
import { UserSample } from 'src/services/user-sample/models';
import { UserSampleStatus, UserSampleType } from 'src/services/user-sample/external';
import { VariantCallAttributes } from 'src/services/variant-call/models';

export async function geneticsCommand(...args: string[]) {
  const [userId, profile] = args;
  const fn = Profile[profile];
  if (!fn) {
    console.log(`usage: yarn sls seed:genetics --user {userId} --genetics {${Object.keys(Profile).join('|')}`);
    process.exit(1);
  }
  await fn(userId);
}

function makeRandomVariantIndexes(geneVariants: {[variant: string]: VariantCallAttributes }): number[] {
  const vIndexes = [];
  
  for (let i = 0; i < Object.keys(geneVariants).length; i++) {
    if (random.boolean()) {
      vIndexes.push(i);
    }
  }
  return vIndexes;
}

function randomGenotype() {
  return random.boolean() ? 'het' : 'hom';
}

function genotypeCreator(requestedGenotype: string, ...vIndexes: number[]) {
  const randomize = requestedGenotype === 'random';
  return async function (userId: string) {
    const userSample = UserSample.createAsync({
      userId: userId, id: `${userId}-seed-sample`, seed: true, source: '23andme', 
      status: UserSampleStatus.ready, type: UserSampleType.genetics
    });
    // each gene has many variants (see GeneVariants) - which are indexed from 0
    // in order. E.g., mthfr has c677t and 1298c, which are vIndexes 0 and 1, respectively
    const variants = flatMap(map(GeneVariants, gene => {
      let vIndex = 0;
      if (randomize) {
        vIndexes = makeRandomVariantIndexes(gene);
      }
      return map(gene, variant => {
        // if this vIndex is set, then use the genotype for this variant, otherwise it is wildtype
        const genotype = randomize ? randomGenotype() : requestedGenotype;
        let vType = vIndexes.indexOf(vIndex) !== -1 ? genotype : 'wt';
        vIndex++;
        return makeVariant(userId, variant, vType);
      });
    }));
    console.log(`Creating ${variants.length} variants for userId '${userId}'`);
    return Promise.all<any>([...variants, userSample]); // tslint:disable-line no-any
  };
}

const Profile = {
  wt: genotypeCreator('wt'),
  het: genotypeCreator('het', 0),
  hom: genotypeCreator('hom', 0),
  random: genotypeCreator('random'),
  
  // only the second variant heterozygotic:
  'less-common-het': genotypeCreator('het', 1),
  
  // all variants included as heterozygotes:
  'compound-het': genotypeCreator('het', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9) // assume there are <= 10 variants
};
