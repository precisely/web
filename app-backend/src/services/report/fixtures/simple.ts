/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:35 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:50:35 
 */

import { Report } from '../../models';
import { addVariants } from 'src/services/variant-call/test-helpers';
import { addFixtures } from 'src/common/fixtures';
import { VariantCall } from 'src/services/variant-call';

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
  const variantData = [
    { userId: 'user-wt10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 0], sampleType: '23andme', sampleId: 'userwt-23andme' },
    { userId: 'user-het10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 1], sampleType: '23andme', sampleId: 'userhet10t-23andme' },
    { userId: 'user-het10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 2], sampleType: '23andme', sampleId: 'userhet10c-23andme' },            
    { userId: 'user-hom10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [1, 1], sampleType: '23andme', sampleId: 'userhom-23andme' },
    { userId: 'user-hom10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [2, 2], sampleType: '23andme', sampleId: 'userhomc-23andme' },
    // compound heterozygote:
    { userId: 'user-cmpnd10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [1, 2], sampleType: '23andme', sampleId: 'usercmpd-23andme' }
  ];
  const variants: VariantCall[] = await addVariants(...variantData);
  const report = new Report({
    ownerId: 'author',
    content: `<AnalysisBox>
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
              </AnalysisBox>`,
    title: 'variant-test'
  });
  await addFixtures(report);
  
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

  return  {report, variants};
}
