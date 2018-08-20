/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-20 11:32:22 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-20 11:34:11
 */

 // This file a typescript wrapper around seqvarnomjs

interface Variant {
  type: string;
  toString(): string;
}

interface Interval {
  start: number;
  end: number;
}

interface SimpleVariant extends Variant {
  pos: number | Interval;
  edit: NARefAlt | null;
  uncertain: boolean;
} 

interface RelativeVariant {
  variants: Variant[];
}

interface TransVariant extends RelativeVariant {
  
}

interface UnphasedVariant extends RelativeVariant {
  
}

interface CisVariant extends RelativeVariant {

}

interface NARefAlt {
  pos: number;
  ref: string;
  alt: string;
}

interface SequenceVariant {
  ac: string;
  variant: Variant;
  listSimpleVariants(): SimpleVariant[];
  matches(other: SequenceVariant): boolean;
}
const {
  parse, 
  SequenceVariant, 
  NARefAlt, Interval,
  SimpleVariant, TransVariant, UnphasedVariant, CisVariant
}: { 
  parse: (i: string) => SequenceVariant,
  SequenceVariant: new() => SequenceVariant,
  NARefAlt: new() => NARefAlt,
  Interval: new() => Interval,
  SimpleVariant: new () => SimpleVariant,
  TransVariant: new () => TransVariant,
  UnphasedVariant: new () => UnphasedVariant,
  CisVariant: new () => CisVariant
} = require('seqvarnomjs');

export { parse, 
  SequenceVariant, SimpleVariant, TransVariant, UnphasedVariant, CisVariant,
  NARefAlt, Interval
};
