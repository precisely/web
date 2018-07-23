import { Report } from '../../models';
import { addVariants } from 'src/services/variant-call/test-helpers';
import { addFixtures } from 'src/common/fixtures';

//
// This file provides generates users with variants 
//  Users with variants at chromosome 1, position 10:
//    user-wt10
//    user-het10t
//    user-het10c
//    user-hom10t
//    user-hom10c
//    user-cmpnd10

export async function addReportPersonalizationFixtures() {
  const variants = await addVariants(
    { userId: 'user-wt10', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 0],
      callSetId: 'userwt-23andme' },
    { userId: 'user-het10t', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 1],
      callSetId: 'userhet10t-23andme' },
    { userId: 'user-het10c', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 2],
      callSetId: 'userhet10c-23andme' },            
    { userId: 'user-hom10t', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [1, 1],
      callSetId: 'userhom-23andme' },
    { userId: 'user-hom10c', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [2, 2],
      callSetId: 'userhomc-23andme' },
    // compound heterozygote:
    { userId: 'user-cmpnd10', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [1, 2],
      callSetId: 'usercmpd-23andme' }
  );
  const report = new Report({
    ownerId: 'author',
    content: `<AnalysisBox>
                <Analysis case={ variant("chr1:g.[10=];[10=]") }>
                Wild Type
                </Analysis>
                <Analysis case={ variant("chr1:g.[10=];[10A>T]") }>
                Heterozygote-T
                </Analysis>
                <Analysis case={ variant("chr1:g.[10=];[10A>C]") }>
                Heterozygote-C
                </Analysis>
                <Analysis case={ variant("chr1:g.[10A>T];[10A>T]") }>
                Homozygote-T
                </Analysis>
                <Analysis case={ variant("chr1:g.[10A>C];[10A>C]") }>
                Homozygote-C
                </Analysis>
                <Analysis case={ variant("chr1:g.[10A>C];[10A>T]") }>
                Compound Heterozygote
                </Analysis>
              </AnalysisBox>`,
    title: 'variant-test'
  });
  await addFixtures(report);
  return  {report, variants};
}