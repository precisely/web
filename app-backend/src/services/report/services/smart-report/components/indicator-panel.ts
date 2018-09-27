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
 * @Last Modified time: 2018-09-25 12:39:37
 */

 //
 // <IndicatorPanel normal="normal (wildtype)" defective="contains variants"> 
 //   <Indicator icon="gene" name="MTHFR" link="mthfr" normal={variantCall("NC_000001.11:g.[123123=];[123123=]")} />
 //   <Indicator icon="gene" name="CHRN5A" link="chrn5a" normal={variantCall("NC_000002.12:g.[4231345=];[4231345=]")} />
 // </IndicatorPanel>
 //
import { ReducibleTagElement, Context, ReducerFunction, isTagElement } from 'smart-report';
import {ensureAttributes} from './util';
import { isString } from 'util';

export const IndicatorPanel: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  let {normal, defective, default: defaultState} = elt.attrs;
  
  // IndicatorPanel shows a legend, explaining what green vs red means
  normal = normal || 'normal'; // text for green label
  defective = defective || 'defective'; // text for red label
  defaultState = defaultState || 'unknown';
  const userSampleStatus = ctx.__userSampleRequirements.status;
  elt.attrs.userSampleStatus = userSampleStatus;
  elt.children.map(child => {
    if (!isTagElement(child) || child.name !== 'indicator') {
      throw new Error(`IndicatorPanel may only contain Indicator elements`);
    }
    child.attrs.default = child.attrs.default || defaultState;
    child.attrs.require = child.attrs.require && userSampleStatus === 'ready';
  });
  return [elt.children, ctx];
};

export const Indicator: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  ensureAttributes('Indicator', elt.attrs, 'icon', 'name');
  const defaultValue = isString(elt.attrs.default) ? elt.attrs.default : 'unknown';
  if (!/normal|defective|unknown/.test(defaultValue)) {
    throw new Error(`Indicator default must be one of normal|defective|unknown, but received ${defaultValue}`);
  }
  // TODO: consider fixing the semantics for determining indicator state. Currently the author defines a default state, 
  //       and defines exceptions to that default:
  // <IndicatorPanel default="normal">
  //   <Indicator defective={some-expr} enhanced={some-expr} /> 
  //   ...
  // </IndicatorPanel>
  //
  // The problem with this approach is - which condition is matched first?
  // Possible idea for preserving the overall sematics: match in the order provided.
  if (!elt.attrs.require) {  // requirements not satisfied
    elt.attrs.state = 'unknown';
  } else if (elt.attrs.defective) {
    elt.attrs.state = 'defective';
  } else if (elt.attrs.normal) {
    elt.attrs.state = 'normal';
  } else {
    elt.attrs.state = defaultValue;
  }
  return [[], ctx];
};
