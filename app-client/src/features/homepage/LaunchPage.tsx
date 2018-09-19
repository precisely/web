/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {CSS} from 'src/interfaces';
import {helveticaFont, preciselyMagenta} from 'src/constants/styleGuide';
import { Container, Col } from 'src/features/common/ReusableComponents';
import { preciselyGreen, white } from '../../constants/styleGuide';


const faces = require('src/assets/faces-v-3-b.jpg');
const iconGallery = require('src/assets/icon-gallery.png');


@Radium
export class LaunchPage extends React.Component<RouteComponentProps<void>> {

  render(): JSX.Element {
    return (
      <div>
        <NavigationBar {...this.props} hideMenu={true} backgroundColor="transparent" />
        <h1 style={{...titleStyle, color: preciselyGreen}}>
          Personalized Genetic Reports from the World’s Experts
        </h1>
        <div style={imageStyle} />
        <div>
          {this.renderValueProp()}
        </div>
      </div>
    );
  }

  renderValueProp = (): JSX.Element => {
    return (
      <Container>
        <div className="pt-4 pb-4" style={{textAlign: 'center'}}>
          <h4 style={headingStyle}>
            <span style={{color: preciselyMagenta}}>Precise.ly</span>
            <span> — Discover the genetic basis of your health</span>
          </h4>
        </div>
        <Container className="pt-2 pb-2">
          <img src={iconGallery} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%'}} />
        </Container>
      </Container>
    );
  }

}


const containerStyle: CSS = {
  position: 'relative',
  width: '100%',
  height: '50vh',
  overflow: 'hidden'
};

const imageStyle: CSS = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '40vh',
  backgroundPosition: 'center',
};

const parallaxChildren: CSS = {
  position: 'absolute',
  top: '2%',
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  textAlign: 'center',
};

const headingStyle: CSS = {
  ...helveticaFont,
  fontWeight: 200
};

const homepageSection: CSS = {
  fontSize: '36px'
};

const titleStyle: React.CSSProperties = {
  ...helveticaFont,
  fontSize: '36px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#00bc3e'
};
