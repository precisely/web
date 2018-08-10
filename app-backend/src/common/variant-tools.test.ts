/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:51:29 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:51:29 
 */

import { 
  refToNCBIAccession, ncbiAccessionToRef, normalizeNCBIAccession, normalizeReferenceName 
} from 'src/common/variant-tools';

describe('variant-tools', function () {
  describe('refToNCBIAccession', function () {
    it('should convert a refName/refVersion to the appropriate NCBI accession number', function () {
      expect(refToNCBIAccession('chr1', '37p13')).toEqual('NC_000001.10');
      expect(refToNCBIAccession('chr2', '37p13')).toEqual('NC_000002.11');
      expect(refToNCBIAccession('chr3', '37p13')).toEqual('NC_000003.11');
      expect(refToNCBIAccession('chr4', '37p13')).toEqual('NC_000004.11');
      expect(refToNCBIAccession('chr5', '37p13')).toEqual('NC_000005.9');
      expect(refToNCBIAccession('chr6', '37p13')).toEqual('NC_000006.11');
      expect(refToNCBIAccession('chr7', '37p13')).toEqual('NC_000007.13');
      expect(refToNCBIAccession('chr8', '37p13')).toEqual('NC_000008.10');
      expect(refToNCBIAccession('chr9', '37p13')).toEqual('NC_000009.11');
      expect(refToNCBIAccession('chr10', '37p13')).toEqual('NC_000010.10');
      expect(refToNCBIAccession('chr11', '37p13')).toEqual('NC_000011.9');
      expect(refToNCBIAccession('chr12', '37p13')).toEqual('NC_000012.11');
      expect(refToNCBIAccession('chr13', '37p13')).toEqual('NC_000013.10');
      expect(refToNCBIAccession('chr14', '37p13')).toEqual('NC_000014.8');
      expect(refToNCBIAccession('chr15', '37p13')).toEqual('NC_000015.9');
      expect(refToNCBIAccession('chr16', '37p13')).toEqual('NC_000016.9');
      expect(refToNCBIAccession('chr17', '37p13')).toEqual('NC_000017.10');
      expect(refToNCBIAccession('chr18', '37p13')).toEqual('NC_000018.9');
      expect(refToNCBIAccession('chr19', '37p13')).toEqual('NC_000019.9');
      expect(refToNCBIAccession('chr20', '37p13')).toEqual('NC_000020.10');
      expect(refToNCBIAccession('chr21', '37p13')).toEqual('NC_000021.8');
      expect(refToNCBIAccession('chr22', '37p13')).toEqual('NC_000022.10');
      expect(refToNCBIAccession('chrX', '37p13')).toEqual('NC_000023.10');
      expect(refToNCBIAccession('chrY', '37p13')).toEqual('NC_000024.9');
      expect(refToNCBIAccession('MT', '37p13')).toEqual('NC_012920.1');
    });

    it('should raise error if an invalid refName is given', function  () {
      expect(() => refToNCBIAccession('foo', '37p13')).toThrow();
      expect(() => refToNCBIAccession('', '37p13')).toThrow();
      expect(() => refToNCBIAccession('1', '37p13')).toThrow();
    });

    it('should accept a verbose refVersion', function () {
      expect(refToNCBIAccession('chr1', 'GRCh37p13')).toEqual(
        refToNCBIAccession('chr1', '37p13')
      );
    });

    it('should raise error if an invalid refName is given', function  () {
      expect(() => refToNCBIAccession('chr1', 'foo')).toThrow();
      expect(() => refToNCBIAccession('chr1', '38p7')).toThrow();
      expect(() => refToNCBIAccession('chr1', '')).toThrow();
    });
  });

  describe('normalizeNCBIAccession', function () {
    it('should accept various alternate forms of NCBI accession number, returning canonical form', function O() {
      expect(normalizeNCBIAccession('NC01.10')).toEqual('NC_000001.10');
      expect(normalizeNCBIAccession('NC0001.10')).toEqual('NC_000001.10');
      expect(normalizeNCBIAccession('nc_1.10')).toEqual('NC_000001.10');
    });

    it('should throw error if an invalid accession is provided', function () {
      expect(() => normalizeNCBIAccession('foo')).toThrow(/Invalid accession/);
    });
  });

  describe('ncbiAccessionToRef', function () {
    it('should accept various alternate forms of NCBI accession number, returning chr.ver ref name', function O() {
      expect(ncbiAccessionToRef('NC01.10')).toEqual('chr1.37p13');
      expect(ncbiAccessionToRef('NC0001.10')).toEqual('chr1.37p13');
      expect(ncbiAccessionToRef('nc_1.10')).toEqual('chr1.37p13');
    });

    it('should throw error if an invalid accession is provided', function () {
      expect(() => ncbiAccessionToRef('NC_000099.99')).toThrow(/Unrecognized accession/);
    });
  });

  describe('normalizeReferenceName', function () {
    it('should return a [chr, ver] two tuple given an NCBI accession', function () {
      expect(normalizeReferenceName('NC1.10')).toEqual(['chr1', '37p13']);
    });

    it('should return a normalized two tuple, given acceptable variations of chr.ver', function () {
      expect(normalizeReferenceName('1.GRCh37p13')).toEqual(['chr1', '37p13']);
      expect(normalizeReferenceName('chr1.GRCh37p13')).toEqual(['chr1', '37p13']);
      expect(normalizeReferenceName('chr1.37p13')).toEqual(['chr1', '37p13']);
    });

    it('should throw an error for invalid inputs', function () {
      expect(() => normalizeReferenceName('foo')).toThrow();
      expect(() => normalizeReferenceName('chr99.37p13')).toThrow();
      expect(() => normalizeReferenceName('chr1')).toThrow();
      expect(() => normalizeReferenceName('chr1.38p99')).toThrow();
    });
  });

});
