/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
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

export enum IndicatorStates {
  normal = 'normal',
  defective = 'defective',
  enhanced = 'enhanced',
  unknown = 'unknown'
}
export enum IndicatorIcons {
  dna = 'dna'
}
export const IndicatorPanel: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  let {icon, normal, defective, default: defaultState} = elt.attrs;
  
  // IndicatorPanel shows a legend, explaining what green vs red means
  icon = icon || 'dna';
  normal = normal || 'normal'; // text for green label
  defective = defective || 'defective'; // text for red label
  defaultState = defaultState || 'unknown';
  checkIcon(icon);
  checkDefaultState(defaultState);
  elt.attrs.personalize = ctx.personalize;
  elt.children.map(child => {
    if (!isTagElement(child) || child.name !== 'indicator') {
      throw new Error(`IndicatorPanel may only contain Indicator elements`);
    }
    // allow passing 'default' and 'require' properties to children:
    child.attrs.default = child.attrs.default || defaultState;
    child.attrs.require = child.attrs.require;
  });
  return [elt.children, ctx];
};

export const Indicator: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  ensureAttributes('Indicator', elt.attrs, 'icon', 'name');
  const defaultValue = isString(elt.attrs.default) ? elt.attrs.default : 'unknown';
  checkDefaultState(defaultValue);

  // TODO: consider fixing the semantics for determining indicator state. Currently the author defines a default state, 
  //       and defines exceptions to that default:
  // <IndicatorPanel default="normal">
  //   <Indicator defective={some-expr} enhanced={some-expr} /> 
  //   ...
  // </IndicatorPanel>
  //
  // The problem with this approach is - which condition is matched first?
  // Possible idea for preserving the overall sematics: match in the order provided.
  if (!ctx.personalize) {
    elt.attrs.state = 'unknown';
  } else if (!elt.attrs.require) {  // requirements not satisfied
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

function checkDefaultState(defaultState: any): defaultState is keyof IndicatorStates { // tslint:disable-line no-any
  if (!isString(defaultState) || !IndicatorStates[defaultState]) {
    throw new Error(`Invalid default state ${defaultState}. Expecting one of ${
      Object.keys(IndicatorStates).join(', ')
    }`);
  }
  return true;
}

function checkIcon(icon: any): icon is keyof IndicatorIcons { // tslint:disable-line no-any
  if (!isString(icon) || !IndicatorIcons[icon]) {
    throw new Error(`Invalid Indicator icon (${icon}). Must be one of: ${Object.keys(IndicatorIcons).join(',')}`);
  }
  return true;  
}
