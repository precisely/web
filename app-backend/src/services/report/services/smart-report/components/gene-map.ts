/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-17 08:26:01 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-21 16:26:26
 */

import { ReducibleTagElement, Context, ReducerFunction, ReducibleElement, isTagElement } from 'smart-report';

import { parse, Interval, SimpleVariant, SequenceVariant, NARefAlt } from 'src/common/svn'; 

import { isString, isNumber } from 'util';
import {ensureAttributes} from './util';

export const GeneMap: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  ensureAttributes('GeneMap', elt.attrs, 'interval');
  
  const interval: GeneMapInterval = parseGeneMapInterval(elt);
  
  return [elt.children.map(makeGeneMapChildVariantProcessor(interval)), ctx];
};

type GeneMapInterval = {
  start: number,
  end: number,
  accession: string
};

/**
 * Returns a function which parses the hgvs attribute of a <Variant hgvs="...."> tag which 
 *   1. checks that the variant is within the bounds of the gene map
 *   2. checks that the variant is 
 * 
 * @param param0 
 */
export function makeGeneMapChildVariantProcessor({ accession, start, end }: GeneMapInterval) {
  return (child: ReducibleElement) => {
    if (isTagElement(child) && child.name === 'variant') {
      const {hgvs} = child.attrs;

      if (!isString(hgvs)) {
        throw new Error(`Expecting hgvs to be set in ${child.toString()}`);
      }

      const variant = parse(hgvs);
      if (variant.ac !== accession) {
        throw new Error(`Expecting matching accession ${accession} for GeneMap Variant ${variant.toString()}`);
      }
      const simpleVariant = variant.variant;
      if (
        !(simpleVariant instanceof SimpleVariant) || 
        !isNumber(simpleVariant.pos) || 
        !(simpleVariant.edit && simpleVariant.edit instanceof NARefAlt)
      ) {
        throw new Error(`Expecting hgvs attribute to be a simple variant like NC_000001.10:g.123A>C`);
      }

      if (simpleVariant.pos < start || simpleVariant.pos > end) {
        throw new Error(`Variant ${child.toString()} represents a change outside of the GeneMap interval`);
      }

      if (variant.ac.toLowerCase() !== accession.toLowerCase()) {
        throw new Error(`Variant ${child.toString()} does match the expected accession number ${accession}`);
      }

      child.attrs.pos = simpleVariant.pos;
      child.attrs.refBases = simpleVariant.edit.ref;
      child.attrs.altBases = simpleVariant.edit.alt;
      
    }
    return child;
  };
}

/**
 * Extracts start, end and accession from the interval attribute, which is expected to
 * be a string of the form "{accession}:g.{start}_{end}", representing a seqvarnomjs 
 * SequenceVariant containing a SimpleVariant having a position with an interval 
 * from {start} to {end}
 * 
 * @param elt 
 */
export function parseGeneMapInterval(elt: ReducibleTagElement): GeneMapInterval {
  const { interval } = elt.attrs;
  
  if (!isString(interval)) {
    throw new Error(`Invalid interval attribute for GeneMap`);
  }
  
  const seqVariant: SequenceVariant = parse(interval);
  if (seqVariant.variant.type !== 'simple' || !((<SimpleVariant> seqVariant.variant).pos instanceof Interval)) {
    throw new Error(`Invalid interval ${interval} - expecting input like NC_000001.10:g.1111_2222`);
  }

  const simpleVariant: SimpleVariant = <SimpleVariant> seqVariant.variant;
  const svnInterval: Interval = <Interval> simpleVariant.pos;

  const result = {start: svnInterval.start, end: svnInterval.end, accession: seqVariant.ac};
  Object.assign(elt.attrs, result);

  if (!elt.attrs.start || !elt.attrs.end) {
    throw new Error(`GeneMap must contain start and end coordinates`);
  }

  return result;
}
