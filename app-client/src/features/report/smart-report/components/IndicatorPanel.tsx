/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-10-16 09:48:39
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-26 17:06:42
 */

import * as React from 'react';
import { IndicatorProps } from './Indicator';
import { colors } from '../../../../constants/styles';

const normalDot = require('src/assets/indicator/legend/normal.png');
const defectiveDot = require('src/assets/indicator/legend/defective.png');
const enhancedDot = require('src/assets/indicator/legend/enhanced.png');
const unknownDot = require('src/assets/indicator/legend/unknown.png');

export class IndicatorPanel extends React.Component<
{ normal: string, defective: string, enhanced: string, unknown: string, personalize: boolean}
> {

  constructor(props: any) {
    super(props);
  }

  render() {
    const style: any = {minHeight: '200px', display: 'block', overflow: 'auto', position: 'relative', minWidth: '100%', textAlign: 'center'};
    const children: React.ReactNode = this.props.children;
    const legend: JSX.Element = this.props.personalize ? this.renderLegend() : (
      <p style={{textAlign: 'left', color: colors.grey1}}>
        <em>Your personalized results will appear here</em>
      </p>
    );

    return (
      <>
        <div style={style}>
          {legend}
          <div style={{position: 'absolute', overflow: 'auto'}}>
            {children}
          </div>
        </div>
      </>
    );
  }

  disabledChildren() {
    return React.Children.map(
      this.props.children, (child: React.ReactElement<IndicatorProps>) => React.cloneElement<IndicatorProps>(child, {
        state: 'unknown', disabled: true
      })
    );
  }


  renderLegend() {
    return (
      <>
      <img src={normalDot}/><span>{this.props.normal}</span>
      <img src={defectiveDot}/><span>{this.props.defective}</span>
      {this.props.enhanced ? <><img src={enhancedDot}/><span>{this.props.enhanced}</span></> : null}
      {this.props.unknown ? <><img src={unknownDot}/><span>{this.props.unknown}</span></> : null}
      </>
    );
  }
}
