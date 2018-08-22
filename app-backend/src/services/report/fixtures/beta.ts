/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-13 15:10:44 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-21 07:33:55
 */

// This file represent fixtures for reports in the beta product

import { Report } from '../models';
import { reportContent } from './util';
import { addFixtures } from 'src/common/fixtures';
import { VariantCall } from 'src/services/variant-call';
import { addVariants } from 'src/services/variant-call/test-helpers';

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
    ... makeVariantData('user-a1298c-hom-c677t-het', { c677t: [1, 0], a1298c: [1, 1]})
  ];
  const variants: VariantCall[] = await addVariants(...variantData);

  const report = new Report({
    ownerId: 'author',
    title: 'mthfr',
    content: reportContent('mthfr')
  });

  await addFixtures(report);
  
  return {report, variants};
}

function makeVariantData(userId: string, { c677t, a1298c }: {
  c677t: [number, number],
  a1298c: [number, number]
}) {
  return [
    { userId: userId, refName: 'chr1', refVersion: '37p13', start: 11856378, refBases: 'G', 
    altBases: [ 'A' ], genotype: c677t, sampleType: '23andme', sampleId: 'userwt-23andme' },
    { userId: userId, refName: 'chr1', refVersion: '37p13', start: 11854476, refBases: 'C', 
    altBases: [ 'T' ],  genotype: a1298c, sampleType: '23andme', sampleId: 'userwt-23andme' },
  ];
}