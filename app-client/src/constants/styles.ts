/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import { CSSProperties } from 'react';


export type ExtendedCSSProperties = CSSProperties & { [key: string]: any }; // to accomodate media queries and other special Radium strings


export const colors: {[key: string]: string} = {
  grey1: '#6c757d',
  grey2: '#545b62',
  white: '#FFF',
  offWhite: '#F5F5F5',
  blue: '#2b3fe0',
  disabledBlue: 'rgb(202, 208, 246)',
  preciselyOrange: '#FF8A4B',
  preciselyMagenta: '#c83a6e',
  preciselyGreen: '#00bc3e',
  preciselyPurple: '#a56aa3',
  preciselyPurpleAlpha: 'rgba(165, 106, 163, 0.85)',
  defaultTextColor: '#4a4a4a',
  defaultBackground: '#F5F5F5'
};


export const analysisColors: {[key: string]: string} = {
  defective: '#fc3f28',
  normal: '#00bc3e',
  enhanced: '#2B3FE0',
  unknown: '#9B9B9B'
};


export const fonts: {[key: string]: CSSProperties} = {

  helvetica: {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif'
  },

  helveticaThin: {
    fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
    fontWeight: 300
  }

};


export const actionButtonStyle: CSSProperties = {
  backgroundColor: 'rgba(43, 63, 224, 0.8)',
  borderRadius: '8px',
  border: 0,
  paddingLeft: '85px',
  paddingRight: '85px',
  paddingTop: '5px',
  paddingBottom: '5px',
  fontSize: '16px',
  fontWeight: 300,
  cursor: 'pointer',
  color: colors.white
};
