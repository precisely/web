/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 */

import * as React from 'react';
import Radium from 'radium';

import * as Styles from 'src/constants/styles';


export type IndicatorProps = {icon: string, name: string, state: string, link: string, disabled: boolean};


const buttons = {
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
    },
    enhanced: {
      rest: require('src/assets/indicator/dna/enhanced/rest.png'),
      hover: require('src/assets/indicator/dna/enhanced/hover.png'),
      down: require('src/assets/indicator/dna/enhanced/down.png'),
      disabled: require('src/assets/indicator/dna/enhanced/disabled.png')
    }
  }
};


const labelColors = {
  normal: {
    rest: 'rgb(41, 190, 80)',
    hover: 'rgb(34, 145, 64)',
    down: 'rgb(23, 101, 46)',
    disabled: 'rgb(196, 237, 209)'
  },
  defective: {
    rest: 'rgb(249, 76, 64)',
    hover: 'rgb(189, 61, 50)',
    down: 'rgb(130, 45, 37)',
    disabled: 'rgb(252, 208, 203)'
  },
  unknown: {
    rest: 'rgb(160, 160, 160)',
    hover: 'rgb(124, 124, 124)',
    down: 'rgb(89, 89, 89)',
    disabled: 'rgb(229, 229, 229)'
  }
};


export const Indicator: React.StatelessComponent<IndicatorProps> = Radium(({icon, name, state, link, disabled}: IndicatorProps) => {
  const clickHandler = () => {
    window.location.href = link;
  };
  return (
    <div onClick={disabled ? null : clickHandler} style={indicatorStyle(icon, state, disabled)}>{name}</div>
  );
});


const indicatorStyle = (icon: string, state: string, disabled: boolean): Styles.ExtendedCSSProperties => {
  const fontColor = labelColors[state][disabled ? 'disabled' : 'rest'];

  return {
    width: '89px',
    height: '45px',
    float: 'left',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '12px',
    marginBottom: '13px',
    textTransform: 'uppercase',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '26px',
    cursor: 'pointer',
    color: fontColor,
    backgroundImage: `url(${buttons[icon][state][disabled ? 'disabled' : 'rest']})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    ':hover': {
      color: labelColors[state][disabled ? 'disabled' : 'hover'],
      backgroundImage: `url(${buttons[icon][state][disabled ? 'disabled' : 'hover']})`
    },
    ':active': {
      color: labelColors[state][disabled ? 'disabled' : 'down'],
      backgroundImage: `url(${buttons[icon][state][disabled ? 'disabled' : 'down']})`
    }
  };
};
