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
  preciselyOrange: '#FF8A4B',
  preciselyMagenta: '#c83a6e',
  preciselyGreen: '#00bc3e',
  preciselyPurple: '#9d6ca0',
  defaultTextColor: '#4a4a4a',

  buttonDefault: '#6c757d',
  buttonHover: '#545b62',
  defaultBackground: '#F5F5F5',
  authLockButtonBackground: '#FF8A4B'

};


export const AnalysisColors: {[key: string]: string} = {
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


export const inputStyle: ExtendedCSSProperties = {
  width: '385px',
  height: '44px',
  '@media screen and (max-width: 700px)': {
    width: '249px'
  },
  ':focus': {
    borderColor: '#d9d9d9'
  }
};

export const formButton: ExtendedCSSProperties = {
  width: '100%',
  color: '#fff',
  backgroundColor: colors.buttonDefault,
  borderColor: colors.buttonDefault,
  marginTop: '15px',
  ...inputStyle,
  ':hover': {
    backgroundColor: colors.buttonHover,
    borderColor: colors.buttonHover
  }
};

export const removeBorderRadius: CSSProperties = {
  borderRadius: 0
};

export const noBorderTop: CSSProperties = {
  borderTop: 'none',
  ...removeBorderRadius
};

export const container: CSSProperties = {
  height: '-webkit-fill-available',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.defaultBackground,
  padding: 0
};

export const header: CSSProperties = {
  textAlign: 'center',
  fontWeight: 200,
  fontSize: '30px',
  marginBottom: '25px',
  marginTop: '65px'
};

export const loginAndSignupPanel: ExtendedCSSProperties = {
  width: '597px',
  '@media screen and (max-width: 700px)': {
    width: '345px'
  }
};

export const alignCenter: CSSProperties = {
  textAlign: 'center' // '-webkit-center'
};

export const formMargin: CSSProperties = {
  marginTop: '37px',
  marginBottom: '35px'
};
