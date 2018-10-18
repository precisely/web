/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as Radium from 'radium';
import * as React from 'react';
import * as ReactRouter from 'react-router';

import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';


const faces = require('src/assets/home/faces.png');
const iconGallery = require('src/assets/home/icon-gallery.png');
const logo = require('src/assets/logo/with-lines/small.png');


@Radium
export class LaunchPage extends React.Component<ReactRouter.RouteComponentProps<void>> {

  // NB: This is the temporary placeholder landing page. Its app counterpart is
  // HomePage.tsx.

  render(): JSX.Element {
    return (
      <div style={pageStyle}>
        <RW.Navbar light={true} sticky="top" expand="md" toggleable="md" className="navbar" style={navbarStyle}>
          <RW.NavbarBrand href="/" style={navbarBrandStyle}>
            <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
            <span style={logoTextStyle}>Precise.ly</span>
          </RW.NavbarBrand>
        </RW.Navbar>
        <h1 style={{...titleStyle, color: Styles.colors.preciselyGreen, backgroundColor: 'transparent'}}>
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
      <RW.Container>
        <div className="pt-4 pb-4" style={{textAlign: 'center'}}>
          <h4 style={headingStyle}>
            <span style={{color: Styles.colors.preciselyMagenta}}>Precise.ly</span>
            <span> — Discover the genetic basis of your health</span>
          </h4>
        </div>
        <RW.Container className="pt-2 pb-2">
          <img src={iconGallery} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%'}} />
        </RW.Container>
      </RW.Container>
    );
  }

}


const pageStyle: React.CSSProperties = {
  backgroundColor: 'white'
};

const navbarBrandStyle: React.CSSProperties = {
  display: 'flex',
  verticalAlign: 'middle'
};

const imageStyle: React.CSSProperties = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '500px',
  backgroundPosition: 'center',
};

const headingStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  fontWeight: 200
};

const titleStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  fontSize: '36px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#00bc3e'
};

const navbarStyle: Styles.ExtendedCSSProperties = {
  letterSpacing: '-1px',
  transition: 'background-color 0.4s ease',
  '@media screen and (min-width: 992px)': {
    padding: '8px 245px',
  },
  textTransform: 'uppercase',
  backgroundColor: 'white'
};

const logoStyle: React.CSSProperties = {
  width: '40px',
  height: '40px'
};

const logoTextStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  paddingLeft: '12px',
  // width: '89px',
  height: '34px',
  fontSize: '34px',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '40px',
  // letterSpacing: 'normal',
  color: Styles.colors.preciselyMagenta,
  letterSpacing: '0.01em',
  textTransform: 'none'
};
