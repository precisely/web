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

export type IndicatorProps = {icon: string, name: string, state: string, link: string, disabled: boolean};

export const Indicator: React.StatelessComponent<IndicatorProps> = ({icon, name, state, link, disabled}: IndicatorProps) => {
  const iconImage = disabled ? BUTTON[icon][state]['disabled'] : BUTTON[icon][state]['rest'];
  // FIXME: need to incorporate hover, down, disabled states
  const clickHandler = () => {
    console.log('Navigating to %s', link);
    window.location.href = link;
  };
  // FIXME: these aren't the right colors:
  const fontColor = disabled ? 'lightgray' : 'black';
  return (
    <div style={{float: 'left', margin: '5px'}} onClick={disabled ? null : clickHandler}>
      <div key="indicatorName" style={{color: fontColor}}>{name}</div>
      <div key="indicatorImage"><img src={iconImage}/></div>
    </div>
  );
};


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
