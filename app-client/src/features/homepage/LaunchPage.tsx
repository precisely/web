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
type CSSProperties = React.CSSProperties;
import {helveticaThinFont, preciselyMagenta, preciselyGreen} from 'src/constants/styleGuide';
import { Container } from 'src/features/common/ReusableComponents';
import { Navbar, NavbarBrand } from '../common/ReusableComponents';
import { ExtendedCSSProperties } from '../../constants/styleGuide';

const faces = require('src/assets/home/faces.png');
const iconGallery = require('src/assets/home/icon-gallery.png');
const logo = require('src/assets/logo/with-lines/small.png');

@Radium
export class LaunchPage extends React.Component<RouteComponentProps<void>> {

  // componentDidMount() {
  //   document.body.style.backgroundColor = 'white';
  // }

  render(): JSX.Element {
    return (
      <div style={{backgroundColor: 'white'}}>
        <Navbar light={true} sticky="top" expand="md" toggleable="md" className="navbar" style={navBar}>
          <NavbarBrand href="/">
            <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
            <span style={logoTextStyle}>Precise.ly</span>
          </NavbarBrand>
        </Navbar>
        <h1 style={{...titleStyle, color: preciselyGreen, backgroundColor: 'transparent'}}>
          Personalized Genetic Reports for Chronic Disease
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

const imageStyle: CSSProperties = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '500px',
  backgroundPosition: 'center',
};

const headingStyle: CSSProperties = {
  ...helveticaThinFont,
  fontWeight: 200
};

const titleStyle: React.CSSProperties = {
  ...helveticaThinFont,
  fontSize: '36px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#00bc3e'
};

const navBar: ExtendedCSSProperties = {
  letterSpacing: '-1px',
  transition: 'background-color 0.4s ease',
  '@media screen and (min-width: 992px)': {
    padding: '8px 245px',
  },
  textTransform: 'uppercase',
  backgroundColor: 'white'
};

const logoStyle: CSSProperties = {
  width: '26px',
};

const logoTextStyle: CSSProperties = {
  ...helveticaThinFont,
  paddingLeft: '4px',
  // width: '89px',
  height: '24px',
  fontSize: '20px',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  // letterSpacing: 'normal',
  color: preciselyMagenta,
  // letterSpacing: '-0.6px',
  textTransform: 'none'
};
