/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { VariantCall } from './models';

describe('VariantCall', function () {
  describe('forUser', function () {
    it.skip('should retrieve an instance if the user has variant calls for those ref-indexes', () => null);
    it.skip("should retrieve an empty list if the user doesn't have variant calls for those ref-indexes", () => null);
    it.skip('should retrieve an instance for a user given VariantCallIndexes with rsIds', () => null);
    it.skip("should retrieve an empty list if the user doesn't have variant calls for those rsIds", () => null);
    it.skip('should retrieve a list containing variant calls for refIndexes and rsIds', () => null);

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
