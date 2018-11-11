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
import { IndicatorProps } from './Indicator';


const normalDot = require('src/assets/indicator/legend/normal.png');
const defectiveDot = require('src/assets/indicator/legend/defective.png');
const enhancedDot = require('src/assets/indicator/legend/enhanced.png');
const unknownDot = require('src/assets/indicator/legend/unknown.png');


@Radium
export class IndicatorPanel extends React.Component<
{ normal: string, defective: string, enhanced: string, unknown: string, personalize: boolean}
> {

  constructor(props: any) {
    super(props);
  }

  render() {
    const children: React.ReactNode = this.props.children;
    const legend: JSX.Element =
      this.props.personalize ?
      this.renderLegend() : (
        <p style={notPersonalizedStyle}>
          <em>Your personalized results will appear here</em>
        </p>
      );
    return (
      <div style={indicatorPanelStyle}>
        {legend}
        <div style={geneListStyle}>
          {children}
        </div>
      </div>
    );
  }

  disabledChildren() {
    return React.Children.map(
      this.props.children, (child: React.ReactElement<IndicatorProps>) => React.cloneElement<IndicatorProps>(child, {
        state: 'unknown',
        disabled: true
      })
    );
  }

  renderLegend() {
    return (
      <ul id="gene-panel-legend" style={legendStyle}>
        <span style={legendLabelStyle}>Legend:</span>
        <Radium.Style key="1" scopeSelector="#gene-panel-legend li" rules={legendEntryStyle} />
        <Radium.Style key="2" scopeSelector="#gene-panel-legend li img" rules={legendEntryDotStyle} />
        <li><img src={normalDot}/><span>{this.props.normal}</span></li>
        <li><img src={defectiveDot}/><span>{this.props.defective}</span></li>
        {this.props.enhanced ? <li><img src={enhancedDot}/><span>{this.props.enhanced}</span></li> : null}
        {this.props.unknown ? <li><img src={unknownDot}/><span>{this.props.unknown}</span></li> : null}
      </ul>
    );
  }

}


const indicatorPanelStyle: React.CSSProperties = {
  display: 'block',
  overflow: 'auto',
  position: 'relative',
  minWidth: '100%',
  textAlign: 'center'
};

const legendStyle: React.CSSProperties = {
  listStyleType: 'none',
  textAlign: 'left',
  margin: '0px',
  padding: '0px'
};

const legendLabelStyle: React.CSSProperties = {
};

const legendEntryDotStyle: React.CSSProperties = {
  paddingRight: '5px'
};

const legendEntryStyle: React.CSSProperties = {
  display: 'inline',
  margin: '0px',
  padding: '0px',
  paddingLeft: '1em'
};

const notPersonalizedStyle: React.CSSProperties = {
  textAlign: 'left',
  color: Styles.colors.grey1
};

const geneListStyle: React.CSSProperties = {
};
