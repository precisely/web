/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// All the global CSS styles and color constants should be written here

import {CSS} from 'src/interfaces';

export const grey1 = '#6c757d';
export const grey2 = '#545b62';
export const white = '#FFF';
export const offWhite = '#F5F5F5';
export const preciselyOrange = '#FF8A4B';
export const preciselyMagenta = '#c83a6e';
export const preciselyGreen = '#00bc3e';
export const defaultTextColor = '#4a4a4a';

export const AnalysisColors = {
  defective: '#fc3f28',
  normal: '#00bc3e',
  enhanced: '#2B3FE0',
  unknown: '#9B9B9B'
};

export const buttonDefault: string = '#6c757d';
export const buttonHover: string = '#545b62';
export const defaultBackground: string = '#F5F5F5';
export const authLockButtonBackground: string = '#FF8A4B';


export type ExtendedCSS = CSS & { [key: string]: any }; // to accomodate media queries and other special Radium strings

export const helveticaFont: CSS = {
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
};

export const helveticaThinFont: CSS = {
  fontFamily: 'HelveticaNeue-Thin, Helvetica, Arial, sans-serif'
};

export const inputStyle: ExtendedCSS = {
  width: '385px',
  height: '44px',
  '@media screen and (max-width: 700px)': {
    width: '249px'
  },
  ':focus': {
    borderColor: '#d9d9d9'
  }
};

export const formButton: ExtendedCSS = {
  width: '100%',
  color: '#fff',
  backgroundColor: buttonDefault,
  borderColor: buttonDefault,
  marginTop: '15px',
  ...inputStyle,
  ':hover': {
    backgroundColor: buttonHover,
    borderColor: buttonHover
  }
};

export const removeBorderRadius: CSS = {
  borderRadius: 0
};

export const noBorderTop: CSS = {
  borderTop: 'none',
  ...removeBorderRadius
};

export const container: CSS = {
  height: '-webkit-fill-available',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: defaultBackground,
  padding: 0
};

export const header: CSS = {
  textAlign: 'center',
  fontWeight: 200,
  fontSize: '30px',
  marginBottom: '25px',
  marginTop: '65px'
};

export const loginAndSignupPanel: ExtendedCSS = {
  width: '597px',
  '@media screen and (max-width: 700px)': {
    width: '345px'
  }
};

export const alignCenter: CSS = {
  textAlign: 'center' // '-webkit-center'
};

export const formMargin: CSS = {
  marginTop: '37px',
  marginBottom: '35px'
};
