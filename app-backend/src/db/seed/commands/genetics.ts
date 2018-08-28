import { GeneVariants, makeVariant } from './variant';

export async function geneticsCommand(...args: string[]) {
  const [userId, profile] = args;
  const fn = Profile[profile];
  if (!fn) {
    console.log(`usage: yarn sls seed:genetics {userId} {${Object.keys(Profile).join('|')}`);
    process.exit(1);
  }
  await fn(userId);
}

const Profile = {
  /**
   * Wild type variant
   * 
   * @param userId 
   */
  async wt(userId: string) {
    await Promise.all([
      makeVariant(userId, GeneVariants.mthfr.c677t, 'wt'),
      makeVariant(userId, GeneVariants.mthfr.a1298c, 'wt')
    ]);
  },

  /**
   * Adds common simple heterozygotic makeVariants
   * 
   * @param userId 
   */
  async het(userId: string) {
    await Promise.all([
      makeVariant(userId, GeneVariants.mthfr.c677t, 'het'),
      makeVariant(userId, GeneVariants.mthfr.a1298c, 'wt')
    ]);
  },

  /**
   * Where a less common heterozygote exists, load that, otherwise
   * load the common heterozygote
   * 
   * @param userId 
   */
  'less-common-het': async (userId: string) => {
    await Promise.all([
      makeVariant(userId, GeneVariants.mthfr.c677t, 'wt'),
      makeVariant(userId, GeneVariants.mthfr.a1298c, 'het')
    ]);
  },

  /**
   * Homozygotes
   * 
   * @param userId 
   */
  async hom(userId: string) {
    await Promise.all([
      makeVariant(userId, GeneVariants.mthfr.c677t, 'hom')
    ]);
  },

  /**
   * Where a less common heterzygote exists, load a compound heterozygote
   * 
   * @param userId 
   */
  'compound-het': async (userId: string) => {
    await Promise.all([
      makeVariant(userId, GeneVariants.mthfr.c677t, 'het'),
      makeVariant(userId, GeneVariants.mthfr.a1298c, 'het')
    ]);
  }
};
