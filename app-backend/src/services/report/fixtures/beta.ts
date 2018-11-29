/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// This file represent fixtures for reports in the beta product

import { Report } from '../models';
import { reportContent } from './util';
import { addFixtures } from 'src/common/fixtures';
import { VariantCall } from 'src/services/variant-call';
import { addVariants, addUserSamples } from 'src/services/variant-call/test-helpers';
import { UserSampleType, UserSampleStatus } from 'src/services/user-sample/external';
import { isEqual } from 'lodash';

export async function addBetaReportFixtures() {
  const variantData = [
    ... makeVariantData('user-wt', { c677t: [0, 0], a1298c: [0, 0]}),
    ... makeVariantData('user-c677t-het', { c677t: [0, 1], a1298c: [0, 0]}),
    ... makeVariantData('user-c677t-hom', { c677t: [1, 1], a1298c: [0, 0]}),
    ... makeVariantData('user-a1298c-het', { c677t: [0, 0], a1298c: [0, 1]}),
    ... makeVariantData('user-a1298c-hom', { c677t: [0, 0], a1298c: [1, 1]}),
    ... makeVariantData('user-a1298c-c677t-cpd-het', { c677t: [0, 1], a1298c: [0, 1]}),
    ... makeVariantData('user-a1298c-c677t-cpd-hom', { c677t: [1, 1], a1298c: [1, 1]}),
    ... makeVariantData('user-a1298c-het-c677t-hom', { c677t: [1, 1], a1298c: [1, 0]}),
    ... makeVariantData('user-a1298c-hom-c677t-het', { c677t: [1, 0], a1298c: [1, 1]}),
    ... makeVariantData('user-g1192a-het', { g1192a: [1, 0] }),
    ... makeVariantData('user-g1192a-hom', { g1192a: [1, 1] }),
    ... makeVariantData('user-a78573551g-het', { a78573551g: [1, 0] }),
    ... makeVariantData('user-a78573551g-hom', { a78573551g: [1, 1] }),
    ... makeVariantData('user-a78581651t-het', { a78581651t: [1, 0] }),
    ... makeVariantData('user-a78581651t-hom', { a78581651t: [1, 1] }),
    ... makeVariantData('user-c667t-het-g1192a-het', { c677t: [0, 1], g1192a: [1, 0]}),
  ];
  const userSamples = await addUserSamples(variantData.map(vd => vd.userId), {
    type: UserSampleType.genetics,
    source: '23andme',
    status: UserSampleStatus.ready
  });
  const variants: VariantCall[] = await addVariants(...variantData);
  
  const genePanelReport = new Report({
    ownerId: 'author',
    title: 'mecfs',
    content: reportContent('mecfs'),
    userSampleRequirements: [
      { type: UserSampleType.genetics }
    ]
  });

  const geneReport = new Report({
    ownerId: 'author',
    title: 'mthfr',
    content: reportContent('mthfr'),
    userSampleRequirements: [
      { type: UserSampleType.genetics }
    ]
  });

  await addFixtures(geneReport, genePanelReport);
  await geneReport.publish();
  await genePanelReport.publish();
  
  return {geneReport, variants, genePanelReport, userSamples};
}

const WT: [number, number] = [0, 0];

function likelihoods(genotype: number[]): number[] {
  if (isEqual(genotype, [0, 0])) {
    return [1, 0, 0];
  } else if (isEqual(genotype, [0, 1]) || isEqual(genotype, [1, 0])) {
    return [0, 1, 0];
  } else if (isEqual(genotype, [1, 1])) {
    return [0, 0, 1];
  } else {
    return [];
  }
}

type VariantDataGuaranteedKeys = 'userId'|'refVersion'|'start'|'refBases'|'genotype'|'genotypeLikelihood';
function makeVariantData(
  userId: string, 
  { // MTHFR variants
    c677t = WT, a1298c = WT, 
    // CHRNA5 variants
    g1192a = WT, a78573551g = WT, a78581651t = WT 
  }: { [key: string]: [number, number] }
) {
  return [
    { userId: userId, refName: 'chr1', refVersion: '37p13', start: 11856378, refBases: 'G', 
    genotypeLikelihoods: likelihoods(c677t),
    altBases: [ 'A' ], genotype: c677t, sampleSource: '23andme', sampleId: 'userwt-23andme' },
    { userId: userId, refName: 'chr1', refVersion: '37p13', start: 11854476, refBases: 'T', 
    genotypeLikelihoods: likelihoods(a1298c),
    altBases: [ 'G' ],  genotype: a1298c, sampleSource: '23andme', sampleId: 'userwt-23andme' },
    { userId: userId, refName: 'chr15', refVersion: '37p13', start: 78882925, refBases: 'G', 
    genotypeLikelihoods: likelihoods(g1192a),
    altBases: [ 'A' ], genotype: g1192a, sampleSource: '23andme', sampleId: 'userwt-23andme' },
    { userId: userId, refName: 'chr15', refVersion: '37p13', start: 78865893, refBases: 'A', 
    genotypeLikelihoods: likelihoods(a78573551g),
    altBases: [ 'G' ], genotype: a78573551g, sampleSource: '23andme', sampleId: 'userwt-23andme' },
    { userId: userId, refName: 'chr15', refVersion: '37p13', start: 78873993, refBases: 'A', 
    genotypeLikelihoods: likelihoods(a78581651t),
    altBases: [ 'T' ], genotype: a78581651t, sampleSource: '23andme', sampleId: 'userwt-23andme' },
  ];
}
