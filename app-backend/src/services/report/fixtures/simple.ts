/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:35 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-09-25 15:49:28
 */

import { Report } from '../../models';
import { addVariants, addUserSamples } from 'src/services/variant-call/test-helpers';
import { addFixtures } from 'src/common/fixtures';
import { VariantCall } from 'src/services/variant-call';
import { UserSampleType, UserSampleStatus } from 'src/services/user-sample/external';
import { UserSample} from 'src/services/user-sample/models';

//
// This file provides generates users with every combination of variants 
//  relevant to the mthfr report

export async function addSimpleReportFixtures() {
  const userSampleReadyVariantData = [
    { userId: 'user-wt10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme' },
    { userId: 'user-het10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 1], sampleSource: '23andme', sampleId: 'userhet10t-23andme' },
    { userId: 'user-het10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 2], sampleSource: '23andme', sampleId: 'userhet10c-23andme' },            
    { userId: 'user-hom10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [1, 1], sampleSource: '23andme', sampleId: 'userhom-23andme' },
    { userId: 'user-hom10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [2, 2], sampleSource: '23andme', sampleId: 'userhomc-23andme' },
    // compound heterozygote:
    { userId: 'user-cmpnd10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [1, 2], sampleSource: '23andme', sampleId: 'usercmpd-23andme' },
  ];
  const userSampleMissingVariantData = { 
    userId: 'user-sample-missing', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', 
    altBases: [ 'T', 'C'], genotype: [0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme' 
  };
  const userSampleErrorVariantData = { 
    userId: 'user-sample-error', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', 
    altBases: [ 'T', 'C'], genotype: [0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme' 
  };
  
  const userSamples: UserSample[] = [...await addUserSamples(userSampleReadyVariantData.map(vd => vd.userId), {
    status: UserSampleStatus.ready,
    type: UserSampleType.genetics,
    source: '23andme'
  }), 
  ... await addUserSamples( ['user-sample-error'], { 
    status: UserSampleStatus.error,
    type: UserSampleType.genetics,
    source: '23andme' 
  })];
  
  const variantData = [...userSampleReadyVariantData, userSampleMissingVariantData, userSampleErrorVariantData];

  const variants: VariantCall[] = await addVariants(...variantData);
  const report = new Report({
    ownerId: 'author',
    content: `<AnalysisPanel>
                <Analysis case={ variantCall("chr1.37p13:g.[10=];[10=]") }>
                Wild Type
                </Analysis>
                <Analysis case={ variantCall("chr1.37p13:g.[10=];[10A>T]") }>
                Heterozygote-T
                </Analysis>
                <Analysis case={ variantCall("chr1.37p13:g.[10=];[10A>C]") }>
                Heterozygote-C
                </Analysis>
                <Analysis case={ variantCall("chr1.37p13:g.[10A>T];[10A>T]") }>
                Homozygote-T
                </Analysis>
                <Analysis case={ variantCall("chr1.37p13:g.[10A>C];[10A>C]") }>
                Homozygote-C
                </Analysis>
                <Analysis case={ variantCall("chr1.37p13:g.[10A>C];[10A>T]") }>
                Compound Heterozygote
                </Analysis>
              </AnalysisPanel>`,
    title: 'variant-test',
    userSampleRequirements: [{ type: UserSampleType.genetics }]
  });
  await addFixtures(report);
  await report.publish();
  
  const promises = [
    ...<Promise<VariantCall>[]> variants.map(vc => {
      return <Promise<VariantCall>> VariantCall.getAsync(
        vc.get('userId'), 
        vc.get('variantId'),
        { ConsistentRead: true});
    }),
    <Promise<VariantCall>> Report.getAsync(report.get('id'), {ConsistentRead: true})
  ];  

  await Promise.all(promises); 

  return  {report, variants, userSamples};
}
