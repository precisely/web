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
 * @Last Modified time: 2018-08-17 11:30:40
 */

import { ReducibleTagElement, Context, ReducerFunction, ReducibleElement, isTagElement } from 'smart-report';

const { parse, Interval }: { [key: string]: any } = require('seqvarnomjs'); // tslint:disable-line no-any

import { isString } from 'util';

export const GeneMap: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  const { interval } = elt.attrs;
  if (isString(interval)) {
    const svnInterval = parse(interval);
    if (svnInterval.pos instanceof Interval) {
      elt.attrs.start = svnInterval.pos.start;
      elt.attrs.end = svnInterval.pos.end;
    }
  }
  const { start, end } = elt.attrs;
  if (!start || !end) {
    throw new Error(`GeneMap must contain start and end coordinates`);
  }
  return [elt.children.map((child: ReducibleElement) => {
    if (isTagElement(child) && child.name === 'variant') {
    }
    return elt;
  }), ctx];
};
