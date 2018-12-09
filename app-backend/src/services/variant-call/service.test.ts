/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import { VariantCallService } from './service';
import { destroyFixtures } from 'src/common/fixtures';

describe('VariantCallService', function () {
  
  afterEach(destroyFixtures);
  
  describe('addVariantCalls', function () {
    it('should create variants', async function () {
      const result = await VariantCallService.addVariantCalls([
        { refName: 'chr1',  refVersion: '37p13', start: 10, altBases: ['A', 'T'], refBases: 'C',
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', directRead: 'PASS',
          userId: 'the-user-id', genotype: [0, 1], genotypeLikelihoods: [1, 0, 0, 0, 0, 0] },
        { refName: 'chr2', refVersion: '37p13', start: 20, altBases: ['G'], refBases: 'A', 
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', imputed: 'PASS', altBaseDosage: [2],
          userId: 'the-user-id', genotype: [1, 1], genotypeLikelihoods: [0, 0, 1] },
      ]);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.error)).toEqual([undefined, undefined]);
      expect(result).toMatchObject([
        { data: { 
            refName: 'chr1', start: 10, zygosity: 'heterozygous', genotype: [0, 1], 
            genotypeLikelihoods: [1, 0, 0, 0, 0, 0], 
            altBases: ['A', 'T'], refBases: 'C', userId: 'the-user-id' 
          }
        },
        { data: {  
            refName: 'chr2', start: 20, zygosity: 'homozygous', genotype: [1, 1], 
            genotypeLikelihoods: [0, 0, 1],
            refBases: 'A', altBases: ['G'], userId: 'the-user-id'
          }
        }
      ]);
    });

    it('should return result reflecting some invalid inputs', async function () {
      const result = await VariantCallService.addVariantCalls([
        { refName: 'chr1', refVersion: '37p13', start: 10, altBases: ['A'], refBases: 'C', 
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', directRead: 'pass',
          userId: 'the-user-id', genotype: [0, 1], genotypeLikelihoods: [0, 1, 0] },
        { refName: 'chr2', refVersion: '37p13', start: 20, altBases: ['G'], refBases: 'A', 
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', directRead: 'pass',
          userId: 'the-user-id', genotype: [1, 1], genotypeLikelihoods: [0, 1, 0] },
        { refName: 'invalid-ref-name', refVersion: '37p13', start: 20, altBases: ['G'], refBases: 'A', 
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', directRead: 'pass',
          userId: 'the-user-id', genotype: [1, 1], genotypeLikelihoods: [0, 1, 0] },
        { refName: 'chr3', refVersion: 'invalid-ref-version', start: 20, altBases: ['G'], refBases: 'A', 
          sampleSource: '23andme', sampleId: 'b4ccfd7a87a', directRead: 'pass',
          userId: 'the-user-id', genotype: [1, 1], genotypeLikelihoods: [0, 1, 0] },
      ]);
      expect(result).toMatchObject([
        { data: { refName: 'chr1', start: 10, zygosity: 'heterozygous', genotype: [0, 1], 
          genotypeLikelihoods: [0, 1, 0], altBases: ['A'], refBases: 'C', userId: 'the-user-id' }},
        { data: {  refName: 'chr2', start: 20, zygosity: 'homozygous', genotype: [1, 1], genotypeLikelihoods: [0, 1, 0],
          refBases: 'A', altBases: ['G'], userId: 'the-user-id' }},
        { data: { refName: 'invalid-ref-name',  start: 20, altBases: ['G'], refBases: 'A', 
                  sampleSource: '23andme', sampleId: 'b4ccfd7a87a', 
                  userId: 'the-user-id', genotype: [1, 1] },
          error: /^.*/ },
        { data: { refName: 'chr3', refVersion: 'invalid-ref-version', start: 20, altBases: ['G'], refBases: 'A', 
                  sampleSource: '23andme', sampleId: 'b4ccfd7a87a', 
                  userId: 'the-user-id', genotype: [1, 1]},
          error: /.*/
        }
      ]);
    });
  });
}); 
