/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
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
    { userId: 'user-wt10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T'], 
      genotype: [0, 0], genotypeLikelihoods: [1, 0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme', 
      directRead: 'pass' },
    { userId: 'user-het10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T'], 
      genotype: [0, 1], genotypeLikelihoods: [1, 0, 0], sampleSource: '23andme', sampleId: 'userhet10t-23andme', 
      directRead: 'pass' },
    { userId: 'user-het10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: [ 'T', 'C'], 
      genotype: [0, 2], genotypeLikelihoods: [0, 0, 0, 1, 0, 0], sampleSource: '23andme', 
      sampleId: 'userhet10c-23andme', directRead: 'pass' },
    { userId: 'user-hom10t', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: ['T'], 
      genotype: [1, 1], genotypeLikelihoods: [1, 0, 0], sampleSource: '23andme', sampleId: 'userhom-23andme', 
      directRead: 'pass' },
    { userId: 'user-hom10c', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: ['C'], 
      genotype: [1, 1], genotypeLikelihoods: [1, 0, 0], sampleSource: '23andme', sampleId: 'userhomc-23andme', 
      directRead: 'pass' },
    // compound heterozygote:
    { userId: 'user-cmpnd10', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', altBases: ['T', 'C'], 
      genotype: [1, 2], genotypeLikelihoods: [0, 0, 0, 0, 0, 0], 
      sampleSource: '23andme', sampleId: 'usercmpd-23andme', directRead: 'pass' },
  ];
  const userSampleMissingVariantData = { 
    userId: 'user-sample-missing', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', 
    altBases: ['T'], genotype: [0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme',
    genotypeLikelihoods: [1, 0, 0], directRead: 'pass' 
  };
  const userSampleErrorVariantData = { 
    userId: 'user-sample-error', refName: 'chr1', refVersion: '37p13', start: 10, refBases: 'A', 
    altBases: [ 'T'], genotype: [0, 0], sampleSource: '23andme', sampleId: 'userwt-23andme', 
    genotypeLikelihoods: [1, 0, 0], directRead: 'pass' 
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
  }),
  // fixtures for users with multiple samples: three errors
  ... await addUserSamples( ['user-id-100'], {
    id: 'user-id-100-1',
    status: UserSampleStatus.error,
    statusMessage: 'first error for user-id-100',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-100'], {
    id: 'user-id-100-2',
    status: UserSampleStatus.error,
    statusMessage: 'second error for user-id-100',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-100'], {
    id: 'user-id-100-3',
    status: UserSampleStatus.error,
    statusMessage: 'third error for user-id-100',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  // fixtures for users with multiple samples: two errors and ready
  ... await addUserSamples( ['user-id-101'], {
    id: 'user-id-101-1',
    status: UserSampleStatus.error,
    statusMessage: 'first error for user-id-101',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-101'], {
    id: 'user-id-101-2',
    status: UserSampleStatus.error,
    statusMessage: 'second error for user-id-101',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-101'], {
    id: 'user-id-101-3',
    status: UserSampleStatus.ready,
    statusMessage: 'ready for user-id-101',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  // fixtures for users with multiple samples: two errors and processing
  ... await addUserSamples( ['user-id-102'], {
    id: 'user-id-102-1',
    status: UserSampleStatus.error,
    statusMessage: 'first error for user-id-102',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-102'], {
    id: 'user-id-102-2',
    status: UserSampleStatus.error,
    statusMessage: 'second error for user-id-102',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-102'], {
    id: 'user-id-102-3',
    status: UserSampleStatus.processing,
    statusMessage: 'processing for user-id-102',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  // fixtures for users with multiple samples: error, processing, ready
  ... await addUserSamples( ['user-id-103'], {
    id: 'user-id-103-1',
    status: UserSampleStatus.error,
    statusMessage: 'error for user-id-103',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-103'], {
    id: 'user-id-103-2',
    status: UserSampleStatus.processing,
    statusMessage: 'processing for user-id-103',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-103'], {
    id: 'user-id-103-3',
    status: UserSampleStatus.ready,
    statusMessage: 'ready for user-id-103',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  // fixtures for users with multiple samples: error and processing; favors processing
  ... await addUserSamples( ['user-id-104'], {
    id: 'user-id-104-1',
    status: UserSampleStatus.error,
    statusMessage: 'error for user-id-104',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-104'], {
    id: 'user-id-104-2',
    status: UserSampleStatus.processing,
    statusMessage: 'processing for user-id-104',
    type: UserSampleType.genetics,
    source: '23andme'
  }),
  ... await addUserSamples( ['user-id-104'], {
    id: 'user-id-104-3',
    status: UserSampleStatus.error,
    statusMessage: 'ready for user-id-104',
    type: UserSampleType.genetics,
    source: '23andme'
  })
  ];

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
  
  const promises: Promise<any>[] = [ // tslint:disable-line no-any
    ...<Promise<VariantCall>[]> variants.map(vc => {
      return <Promise<VariantCall>> VariantCall.getAsync(
        vc.get('userId'), 
        vc.get('variantId'),
        { ConsistentRead: true});
    }),
    <Promise<Report>> Report.getAsync(report.get('id'), {ConsistentRead: true})
  ];  

  await Promise.all(promises); 
  return  {report, variants, userSamples};
}
