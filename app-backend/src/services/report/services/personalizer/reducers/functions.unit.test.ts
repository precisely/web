import {Context} from 'smart-report';
import {Variant} from 'seqvarnomjs';

import {VariantCall} from 'src/services/variant-call';

import { variant, addVariantCallsToContext } from './functions';

describe('Personalizer reducer functions', function () {
  const context: Context = {};
  beforeEach(function () {
    addVariantCallsToContext([new VariantCall({
      start: 100,
      refName: 'chr1',
      rsId: 'rs100',
      refBases: 'A',
      altBases: ['T', 'C'],
      genotype: [0, 1],
    }), new VariantCall({
      start: 200,
      refName: 'chr2',
      rsId: 'rs200',
      refBases: 'G',
      altBases: ['A', 'T'],
      genotype: [0, 0]
    }), new VariantCall({
      start: 300,
      rsId: 'rs300',
      refName: 'chr3',
      refBases: 'T',
      altBases: ['A', 'G'],
      genotype: [1, 2]
    }), new VariantCall({
      start: 400,
      rsId: 'rs400',
      refName: 'chr4',
      refBases: 'T',
      altBases: ['A', 'G'],
      genotype: [0, 2]
    }),
    new VariantCall({
      start: 500,
      rsId: 'rs500',
      refName: 'chr5',
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
        'chr1:g.[100=];[100A>T]',
        'chr2:g.[200=];[200=]',
        'chr3:g.[300T>A];[300T>G]',
        'chr4:g.[400=];[400T>G]',
        'chr5:g.[500T>A];[500T>A]',
      ]);
    });

    it('should add the rsIds to the context object', function () {
      expect(context.rsIds).toEqual(['rs100', 'rs200', 'rs300', 'rs400', 'rs500']);
    });
  });

  describe('variant', function () {
    describe('detecting variants in context', function () {
      it('should fail to detect a non-existent wild-type variant', function () {
        expect(variant(context, 'chr1:g.[100=];[100=]')).toBeFalsy();
      });

      it('should detect a wild-type variant', function () {
        expect(variant(context, 'chr2:g.[200=];[200=]')).toBeTruthy();
      });

      it('should detect a compound heterozygous variant', function () {
        expect(variant(context, 'chr4:g.[400T>G];[400=]')).toBeTruthy();
      });

      it('should detect a compound heterozygous variant', function () {
        expect(variant(context, 'chr3:g.[300T>G];[300T>A]')).toBeTruthy();
      });

      it('should detect a homozygous variant', function () {
        expect(variant(context, 'chr5:g.[500T>A];[500T>A]')).toBeTruthy();
      });

      it('should return falsy for a monozygous variant', function () {
        expect(variant(context, 'chr1:g.[9999A>T]')).toBeFalsy();
      });
    });
  });

});
