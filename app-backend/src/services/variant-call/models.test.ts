/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

// tslint:disable no-any

import { VariantCall, combinationsWithRepeats, isValidCall } from './models';
import { destroyFixtures, addFixtures, resetAllTables } from 'src/common/fixtures';
import { VariantCallAttributes } from 'src/services/variant-call/models';

const cases = require('jest-in-case');

describe('VariantCall', function () {
  beforeAll(resetAllTables);

  describe('forUser', function () {
    beforeEach(async () => {
      await addFixtures(new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr1',
        refVersion: '37p13',
        directRead: 'PASS',
        start: 100,
        sampleSource: '23andme',
        sampleId: 'sampleId123',
        genotype: [0, 1],
        genotypeLikelihoods: [1, 0, 0],
        refBases: 'c',
        altBases: ['t']
      }), new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr2',
        refVersion: '37p13',
        directRead: 'pass',
        start: 200,
        sampleSource: '23andme',
        sampleId: 'sampleId123',
        genotype: [1, 1],
        genotypeLikelihoods: [1, 0, 0],
        refBases: 'c',
        altBases: ['t']
      }),
      new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr3',
        refVersion: '37p13',
        start: 300,
        directRead: 'pass',
        sampleSource: '23andme',
        sampleId: 'sampleId123',
        genotype: [0, 0],
        genotypeLikelihoods: [1, 0, 0],
        refBases: 'c',
        altBases: ['t']
      }));

      const vcs = await VariantCall.query('bob-user-id').execAsync();
      expect(vcs.Items).toHaveLength(3);
    });
    
    afterEach(destroyFixtures);

    it('should retrieve one item if the user has a variantcall matching the variant index provided', async function () {
      const variantCalls = await VariantCall.forUser('bob-user-id', [{
        refName: 'chr1', refVersion: '37p13', start: 100
      }]);
      expect(variantCalls).toHaveLength(1);
    });

    it('should retrieve no items if the user has no variantcalls matching the variant index provided', 
      async function () {
      const variantCalls = await VariantCall.forUser('bob-user-id', [{
        refName: 'chrX', refVersion: '37p13', start: 100
      }]);
      expect(variantCalls).toHaveLength(0);
    });

    it('should retrieve two items if the user has a variantcalls matching the variant indexes provided', 
      async function () {
      const variantCalls = await VariantCall.forUser('bob-user-id', [{
        refName: 'chr1', refVersion: '37p13', start: 100
      }, {
        refName: 'chr2', refVersion: '37p13', start: 200
      }]);
      expect(variantCalls).toHaveLength(2);
    });

    it("should retrieve an empty list if the user doesn't have variant calls for those ref-indexes", async () => {
      return;
    });
  });

  describe('save', function () {

    describe('failure', function () {
      let vc: VariantCall;
      const baseAttrs = { 
        userId: 'bob-user-id',
        refName: 'chr1',
        refVersion: '37p13',
        start: 100,
        sampleSource: '23andme',
        sampleId: 'sampleId123',
        refBases: 'c',
        altBases: ['t']
      };

      afterEach(() => vc && vc.destroyAsync);
      
      cases('should occur when valid VariantCall is missing genotype', (
        [directRead, imputed]: [string?, string?]
      ) => {
        vc = new VariantCall({
          ...baseAttrs,
          imputed,
          directRead,
          genotypeLikelihoods: [.5, .3, .2]
        });
        expect(vc.saveAsync()).rejects.toBeInstanceOf(Error);
      }, [
        ['pass', 'pass'],
        ['pass', undefined],
        ['pass', 'FAIL'],
        [undefined, 'pass'],
        ['fail', 'pass']
      ]);

      cases('should occur when valid VariantCall is missing genotypeLikelihood', (
        [directRead, imputed]: [string?, string?]
      ) => {
        vc = new VariantCall({
          ...baseAttrs,
          imputed,
          directRead,
          genotype: [1, 1]
        });
        expect(vc.saveAsync()).rejects.toBeInstanceOf(Error);
      }, [
        ['pass', 'pass'],
        ['pass', undefined],
        ['pass', 'FAIL'],
        [undefined, 'pass'],
        ['fail', 'pass']
      ]);

      it('should occur when altBaseDosage is missing and VariantCall was imputed', async function () {
        vc = new VariantCall({
          ...baseAttrs,
          imputed: 'PASS',
          genotype: [1, 1],
          genotypeLikelihoods: [0, 0, 1]
        });
        
        expect(vc.saveAsync()).rejects.toBeInstanceOf(Error);
      });

      cases('should not occur if altBaseDosage is missing but VariantCall is not imputed', (
        { imputed}: { imputed?: string}
      ) => {
        vc = new VariantCall({
          ...baseAttrs,
          imputed,
          directRead: 'PASS',
          genotype: [1, 1],
          genotypeLikelihoods: [0, 0, 1]
        });
        
        expect(vc.saveAsync()).resolves.toBeInstanceOf(VariantCall);
      }, [ {imputed: 'FAIL'}, {imputed: 'fail'}, {imputed: undefined} ]);

      describe('when both direct read and imputation fail', function () {
        cases('should save successfully without genotype and without genotypeLikelihood', (
          [directRead, imputed]: [string?, string?]
        ) => {
          vc = new VariantCall({
            ...baseAttrs,
            directRead, 
            imputed
          });
          return expect(vc.saveAsync()).resolves.toBeInstanceOf(VariantCall);
        }, [
          [ undefined, undefined ],
          [ 'FAIL', 'FAIL' ],
          [ 'fail', undefined ],
          [ undefined, 'fail' ]
        ]);
      });
    });

    describe('a single nucleotide polymorphism', function () {
      let vc: VariantCall;

      beforeAll(async () => {
        vc = await new VariantCall({
          userId: 'bob-user-id',
          refName: 'chr1',
          refVersion: '37p13',
          start: 100,
          sampleSource: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['t'],
          directRead: 'pass',
          imputed: 'fail',
          genotypeLikelihoods: [.5, .3, .2]
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the variantId correctly for a SNP', () => {
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:23andme:sampleId123');
      });

      it('should have properties set as expected', function () {
        expect(vc.get('userId')).toEqual('bob-user-id');
        expect(vc.get('refName')).toEqual('chr1');
        expect(vc.get('refVersion')).toEqual('37p13');
        expect(vc.get('sampleSource')).toEqual('23andme');
        expect(vc.get('sampleId')).toEqual('sampleId123');
        expect(vc.get('directRead')).toEqual('PASS');
        expect(vc.get('imputed')).toEqual('FAIL');
      });

      it('should uppercase the ref and altbases', function () {
        expect(vc.get('refBases')).toEqual('C');
        expect(vc.get('altBases')).toEqual(['T']);
      });
    });

    describe('a variant which includes an insertion', function () {
      let vc: VariantCall;

      beforeAll(async () => {
        vc = await new VariantCall({
          userId: 'bob-user-id',
          refName: 'chr1',
          refVersion: '37p13',
          start: 100,
          sampleSource: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['tag', 't'],
          genotypeLikelihoods: [.5, .3, .2, 1, .2, .7]
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc).toBeDefined();
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:23andme:sampleId123');
      });

    });

    describe('a variant which contains altBase insertions unreferenced by the genotype', function () {
      let vc: VariantCall;

      beforeAll(async () => {
        vc = await new VariantCall({
          userId: 'bob-user-id',
          refName: 'chr1',
          refVersion: '37p13',
          start: 100,
          sampleSource: '23andme',
          sampleId: 'sampleId123',
          genotype: [0, 0],  // NOTE: genotype is wildtype
          refBases: 'c',
          altBases: ['tag', 'tttttt'], // these altBases aren't actually referenced
          genotypeLikelihoods: [.5, .3, .2, .1, 0, .9]
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc).toBeDefined();
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:23andme:sampleId123');
      });

    });

    describe('a variant which represents a deletion', function () {
      let vc: VariantCall;

      beforeAll(async () => {
        vc = await new VariantCall({
          userId: 'bob-user-id',
          refName: 'chr1',
          refVersion: '37p13',
          start: 100,
          sampleSource: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['.'],
          genotypeLikelihoods: [.5, .3, .2]
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc).toBeDefined();
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:23andme:sampleId123');
      });

    });
  });
});

describe('VariantCall helpers', function () {
  describe('repeatingCombinations', function () {
    cases('should return the right number of combinations for a variety of inputs', 
      ([alternatives, selections, combinations]: number[]) => {
        expect(combinationsWithRepeats(alternatives, selections)).toEqual(combinations);
      }, [
        [1, 0, 1],
        [1, 1, 1],
        [2, 1, 2],
        [2, 2, 3],
        [3, 2, 6]
      ]
    );
  });
  
  describe('isValidCall', function () {
    cases('should be valid when imputed is true', function (
      {imputed, directRead, isValid}: VariantCallAttributes & {isValid: boolean}) {
      expect(isValidCall({imputed, directRead})).toEqual(isValid);
    }, [
      { imputed: 'PASS', directRead: 'PASS', isValid: true},
      { imputed: 'pass', directRead: 'pass', isValid: true},
      { imputed: 'FAIL', directRead: 'PASS', isValid: true},
      { imputed: 'PASS', directRead: 'FAIL', isValid: true},
      { imputed: 'FAIL', directRead: 'FAIL', isValid: false},
      { imputed: 'fail', directRead: 'fail', isValid: false},
      { imputed: undefined, directRead: 'PASS', isValid: true},
      { imputed: 'PASS', directRead: undefined, isValid: true},
      { imputed: undefined, directRead: undefined, isValid: false}
    ]);
  });
});
