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
 * @Last Modified time: 2018-09-14 11:09:17
 */

 //
 // <IndicatorPanel normal="normal (wildtype)" abnormal="contains variants"> 
 //   <Indicator icon="gene" name="MTHFR" link="mthfr" normal={variantCall("NC_000001.11:g.[123123=];[123123=]")} />
 //   <Indicator icon="gene" name="CHRN5A" link="chrn5a" normal={variantCall("NC_000002.12:g.[4231345=];[4231345=]")} />
 // </IndicatorPanel>
 //
import { ReducibleTagElement, Context, ReducerFunction, isTagElement } from 'smart-report';
import {ensureAttributes} from './util';
import { isString } from 'util';

export const IndicatorPanel: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  let {normal, abnormal, default: defaultState} = elt.attrs;
  
  // IndicatorPanel shows a legend, explaining what green vs red means
  normal = normal || 'normal'; // text for green label
  abnormal = abnormal || 'abnormal'; // text for red label

  // 
  defaultState = defaultState || 'unknown';

  elt.children.map(child => {
    if (!isTagElement(child) || child.name !== 'indicator') {
      throw new Error(`IndicatorPanel may only contain Indicator elements`);
    }
    child.attrs.default = child.attrs.default || defaultState;
  });
  return [elt.children, ctx];
};

export const Indicator: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  ensureAttributes('Indicator', elt.attrs, 'icon', 'name');
  const defaultValue = isString(elt.attrs.default) ? elt.attrs.default : 'unknown';
  if (!/normal|abnormal|unknown/.test(defaultValue)) {
    throw new Error(`Indicator default must be one of normal|abnormal|unknown, but received ${defaultValue}`);
  }
  if (!elt.attrs.require) {  // requirements not satisfied
    elt.attrs.state = 'unknown';
  } else if (elt.attrs.abnormal) {
    elt.attrs.state = 'abnormal';
  } else if (elt.attrs.normal) {
    elt.attrs.state = 'normal';
  } else {
    elt.attrs.state = defaultValue;
  }
  return [[], ctx];
};
