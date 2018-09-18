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

const scrollParallax = require('react-scroll-parallax');
const Parallax = scrollParallax.Parallax;
const ParallaxProvider = scrollParallax.ParallaxProvider;
const faces = require('src/assets/faces-v-3-b.jpg');
const iconGallery = require('src/assets/icon-gallery.png');

const titleStyle: React.CSSProperties = {
  height: '42.5px',
  fontFamily: 'HelveticaNeue-Thin',
  fontSize: '36px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#00bc3e'
};

@Radium
export class LaunchPage extends React.Component<RouteComponentProps<void>> {
  render(): JSX.Element {
    return (
      <div>
        <NavigationBar {...this.props} hideMenu={true} backgroundColor={white} />
          <ParallaxProvider>
          <div style={containerStyle}>
            <Parallax offsetYMin="-100%" offsetYMax="40%" slowerScrollRate={true}>
              <div style={imageStyle}/>
            </Parallax>
            <div style={parallaxChildren}>
              <h1 style={{...titleStyle, color: preciselyGreen}}>
                Personalized Genetic Reports from the World's Experts
              </h1>
            </div>
          </div>
          </ParallaxProvider>
        <div>
          {this.renderValueProp()}
        </div>
      </div>
    );
  }

  renderValueProp = (): JSX.Element => {
    return (
      <Container className="pt-5 pb-4 ">
        <div className="lead row" style={{fontSize: '0.4em', textAlign: 'justify'}}>
          <Col md={{size: 6, offset: 3}}>
            <h4 style={headingStyle}>
              <span style={{color: preciselyMagenta}}>Precise.ly</span> <span>Discover the genetic basis of your health</span>
            </h4>
            <img src={iconGallery}/>
          </Col>
        </div>
      </Container>
    );
  }
}

const containerStyle: CSS = {
  position: 'relative',
  width: '100%',
  height: '130vh',
  overflow: 'hidden',
  backgroundColor: white
};

const imageStyle: CSS = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '130vh',
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
