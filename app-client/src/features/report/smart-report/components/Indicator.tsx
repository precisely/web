/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-09-25 09:01:39
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-09-25 09:04:14
 */


import * as React from 'react';
import Radium from 'radium';

import * as Styles from 'src/constants/styles';


export type IndicatorProps = {icon: string, name: string, state: string, link: string, disabled: boolean};


const BUTTON = {
  dna: {
    normal: {
      rest: require('src/assets/indicator/dna/normal/rest.png'),
      hover: require('src/assets/indicator/dna/normal/hover.png'),
      down: require('src/assets/indicator/dna/normal/down.png'),
      disabled: require('src/assets/indicator/dna/normal/disabled.png')
    },
    unknown: {
      rest: require('src/assets/indicator/dna/unknown/rest.png'),
      hover: require('src/assets/indicator/dna/unknown/hover.png'),
      down: require('src/assets/indicator/dna/unknown/down.png'),
      disabled: require('src/assets/indicator/dna/unknown/disabled.png')
    },
    defective: {
      rest: require('src/assets/indicator/dna/defective/rest.png'),
      hover: require('src/assets/indicator/dna/defective/hover.png'),
      down: require('src/assets/indicator/dna/defective/down.png'),
      disabled: require('src/assets/indicator/dna/defective/disabled.png')
    }
  }
};


export const Indicator: React.StatelessComponent<IndicatorProps> = Radium(({icon, name, state, link, disabled}: IndicatorProps) => {
  const clickHandler = () => {
    window.location.href = link;
  };
  const fontColor = disabled ? 'lightgray' : 'black';
  return (
    <div style={indicatorBoxStyle} onClick={disabled ? null : clickHandler}>
      <div key="indicatorName" style={indicatorNameStyle(state, disabled)}>{name}</div>
      <div key="indicatorImage" style={indicatorImageStyle(icon, state, disabled)} />
    </div>
  );
});


const indicatorBoxStyle: React.CSSProperties = {
  width: '89px',
  float: 'left',
  marginLeft: '10px',
  marginRight: '10px',
  marginTop: '12px',
  marginBottom: '13px',
  cursor: 'pointer'
};

const indicatorNameStyle = (state: string, disabled: boolean): React.CSSProperties => {
  let fontColor = disabled ? 'lightgray' : 'black';
  if (['normal', 'defective', 'enhanced', 'unknown'].includes(state)) {
    fontColor = Styles.analysisColors[state];
  } else {
    fontColor = Styles.colors.grey2;
  }
  return {
    textTransform: 'uppercase',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '26px',
    color: fontColor
  };
};

const indicatorImageStyle = (icon: string, state: string, disabled: boolean): Styles.ExtendedCSSProperties => {
  return {
    backgroundImage: `url(${BUTTON[icon][state][disabled ? 'disabled' : 'rest']})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '20px',
    ':hover': {
      backgroundImage: `url(${BUTTON[icon][state][disabled ? 'disabled' : 'hover']})`
    },
    ':active': {
      backgroundImage: `url(${BUTTON[icon][state][disabled ? 'disabled' : 'down']})`
    }
  };
};
