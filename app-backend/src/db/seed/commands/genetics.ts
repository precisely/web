import {map, flatMap} from 'lodash';
import { GeneVariants, makeVariant } from './variant';
import { UserSample, UserSampleAttributes } from 'src/services/user-sample/models';
import { UserSampleStatus, UserSampleType } from 'src/services/user-sample/external';

export async function geneticsCommand(...args: string[]) {
  const [userId, profile] = args;
  const fn = Profile[profile];
  if (!fn) {
    console.log(`usage: yarn sls seed:genetics {userId} {${Object.keys(Profile).join('|')}`);
    process.exit(1);
  }
  await fn(userId);
}

function genotypeCreator(genotype: string, ...vIndexes: number[]) {
  return async function (userId: string) {
    const userSample = UserSample.createAsync({
      userId: userId, id: `${userId}-seed-sample`, seed: true, source: '23andme', 
      status: UserSampleStatus.ready, type: UserSampleType.genetics
    });
    const variants = flatMap(map(GeneVariants, gene => {
      let vIndex = 0;
      return map(gene, variant => {
        // if this vIndex is set, then use the genotype for this variant, otherwise it is wildtype
        const vType = vIndexes.indexOf(vIndex) !== -1 ? genotype :  'wt';
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
  
  // only the second variant heterozygotic:
  'less-common-het': genotypeCreator('het', 1),
  
  // all variants included as heterozygotes:
  'compound-het': genotypeCreator('het', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9) // assume there are <= 10 variants
};
