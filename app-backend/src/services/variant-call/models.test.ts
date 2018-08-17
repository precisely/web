/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { VariantCall } from './models';
import { destroyFixtures, addFixtures, resetAllTables } from 'src/common/fixtures';

describe('VariantCall', function () {
  beforeAll(resetAllTables);

  describe('forUser', function () {
    beforeEach(async () => {
      await addFixtures(new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr1',
        refVersion: '37p13',
        start: 100,
        sampleType: '23andme',
        sampleId: 'sampleId123',
        genotype: [0, 1],
        refBases: 'c',
        altBases: ['t']
      }), new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr2',
        refVersion: '37p13',
        start: 200,
        sampleType: '23andme',
        sampleId: 'sampleId123',
        genotype: [1, 1],
        refBases: 'c',
        altBases: ['t']
      }),
      new VariantCall({
        userId: 'bob-user-id',
        refName: 'chr3',
        refVersion: '37p13',
        start: 300,
        sampleType: '23andme',
        sampleId: 'sampleId123',
        genotype: [0, 0],
        refBases: 'c',
        altBases: ['t']
      }));
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
    describe('a single nucleotide polymorphism', function () {
      let vc: VariantCall;

      beforeAll(async () => {
        vc = await new VariantCall({
          userId: 'bob-user-id',
          refName: 'chr1',
          refVersion: '37p13',
          start: 100,
          sampleType: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['t'],
          filter: 'pass',
          imputed: true
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the variantId correctly for a SNP', () => {
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:101:23andme:sampleId123');
      });

      it('should have properties set as expected', function () {
        expect(vc.get('userId')).toEqual('bob-user-id');
        expect(vc.get('refName')).toEqual('chr1');
        expect(vc.get('refVersion')).toEqual('37p13');
        expect(vc.get('sampleType')).toEqual('23andme');
        expect(vc.get('sampleId')).toEqual('sampleId123');
        expect(vc.get('filter')).toEqual('PASS');
        expect(vc.get('imputed')).toEqual(true);
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
          sampleType: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['tag', 't']
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc.get('end')).toEqual(103);
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:103:23andme:sampleId123');
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
          sampleType: '23andme',
          sampleId: 'sampleId123',
          genotype: [0, 0],  // NOTE: genotype is wildtype
          refBases: 'c',
          altBases: ['tag', 'tttttt'] // these altBases aren't actually referenced
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc.get('end')).toEqual(101);
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:101:23andme:sampleId123');
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
          sampleType: '23andme',
          sampleId: 'sampleId123',
          genotype: [1, 1],
          refBases: 'c',
          altBases: ['.']
        }).saveAsync();
      });

      afterAll(async () => {
        await vc.destroyAsync();
      });

      it('should set the end chromosome position correctly', () => {
        expect(vc.get('end')).toEqual(100);
        expect(vc.get('variantId')).toEqual('chr1:37p13:100:100:23andme:sampleId123');
      });

    });
  });
});
