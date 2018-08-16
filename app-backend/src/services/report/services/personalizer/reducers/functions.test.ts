/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:44 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:50:44 
 */

import {Context} from 'smart-report';
import {Variant} from 'seqvarnomjs';

import {VariantCall} from 'src/services/variant-call';

import { variantCall, addVariantCallsToContext } from './functions';

describe('Personalizer reducer functions', function () {
  const context: Context = {};
  beforeEach(function () {
    addVariantCallsToContext([new VariantCall({
      start: 100,
      refName: 'chr1',
      refVersion: '37p13',
      rsId: 'rs100',
      refBases: 'A',
      altBases: ['T', 'C'],
      genotype: [0, 1],
    }), new VariantCall({
      start: 200,
      refName: 'chr2',
      refVersion: '37p13',
      rsId: 'rs200',
      refBases: 'G',
      altBases: ['A', 'T'],
      genotype: [0, 0]
    }), new VariantCall({
      start: 300,
      rsId: 'rs300',
      refName: 'chr3',
      refVersion: '37p13',
      refBases: 'T',
      altBases: ['A', 'G'],
      genotype: [1, 2]
    }), new VariantCall({
      start: 400,
      rsId: 'rs400',
      refName: 'chr4',
      refVersion: '37p13',
      refBases: 'T',
      altBases: ['A', 'G'],
      genotype: [0, 2]
    }),
    new VariantCall({
      start: 500,
      rsId: 'rs500',
      refName: 'chr5',
      refVersion: '37p13',
      refBases: 'T',
      altBases: ['A', 'G'],
      genotype: [1, 1]
    })
    ], context);
  });

  describe('addVariantCallsToContext', function () {
    it('should add a list of svnVariants to the context object', function () {
      expect(context.svnVariants).toBeDefined();
      expect(context.svnVariants.map((v: Variant) => v.toString())).toEqual([
        'chr1.37p13:g.[100=];[100A>T]',
        'chr2.37p13:g.[200=];[200=]',
        'chr3.37p13:g.[300T>A];[300T>G]',
        'chr4.37p13:g.[400=];[400T>G]',
        'chr5.37p13:g.[500T>A];[500T>A]',
      ]);
    });
  });

  describe('variant', function () {
    describe('detecting variants in context', function () {
      it('should fail to detect a non-existent wild-type variant', function () {
        expect(variantCall(context, 'chr1.37p13:g.[100=];[100=]')).toBeFalsy();
      });

      it('should detect a wild-type variant', function () {
        expect(variantCall(context, 'chr2.37p13:g.[200=];[200=]')).toBeTruthy();
      });

      it('should detect a compound heterozygous variant', function () {
        expect(variantCall(context, 'chr4.37p13:g.[400T>G];[400=]')).toBeTruthy();
      });

      it('should detect a compound heterozygous variant', function () {
        expect(variantCall(context, 'chr3.37p13:g.[300T>G];[300T>A]')).toBeTruthy();
      });

      it('should detect a homozygous variant', function () {
        expect(variantCall(context, 'chr5.37p13:g.[500T>A];[500T>A]')).toBeTruthy();
      });

      it('should return falsy for a monozygous variant', function () {
        expect(variantCall(context, 'chr1.37p13:g.[9999A>T]')).toBeFalsy();
      });
    });
  });

});
