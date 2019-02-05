/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import * as ReactRouter from 'react-router';
import Radium from 'radium';

import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';
import { NavigationBar } from 'src/features/common/NavigationBar';


const faces = require('src/assets/home/faces.png');
const dnaImg = require('src/assets/home/icon-dna.png');
const dnaMagnifier = require('src/assets/home/dna-magnifier.png');
const clipboard = require('src/assets/home/clipboard.png');
const upload23andMe = require('src/assets/home/23andme-upload.png');

const iconGallery = require('src/assets/home/icon-gallery.png');
const scrollParallax = require('react-scroll-parallax');
const Parallax = scrollParallax.Parallax;
const ParallaxProvider = scrollParallax.ParallaxProvider;


@Radium
export class HomePage extends React.Component<ReactRouter.RouteComponentProps<void>> {

  // NB: This is the app landing page. Its temporary placeholder non-app-enabled
  // counterpart is LaunchPage.tsx.

  render(): JSX.Element {
    return (
      <div style={pageStyle}>
        <NavigationBar noBorder={true} {...this.props}/>
        <ParallaxProvider>
          <h1 style={titleStyle}>
            Personalized Genetic Reports for Chronic Disease
          </h1>
          <Parallax offsetYMin="-50%" offsetYMax="40%" slowerScrollRate={true}>
            <div style={backgroundStyle} />
          </Parallax>
          {this.renderSlab(this.renderFirstProduct(), false)}
          {this.renderSlab(this.renderHowItWorks(), true)}
          {this.renderSlab(this.renderValueProp(), false)}
        </ParallaxProvider>
      </div>
    );
  }

  renderSlab(content: JSX.Element, alternateColor: boolean = false) {
    return (
      <div style={{position: 'relative', textAlign: 'center', backgroundColor: alternateColor ? Styles.colors.offWhite : Styles.colors.white}}>
        {content}
      </div>
    );
  }

  renderValueProp = (): JSX.Element => {
    return (
      <RW.Container style={valuePropStyle}>
        <h4 style={headingStyle}>
          <span style={{color: Styles.colors.preciselyMagenta}}>Precise.ly</span>
          <span> — Discover the genetic basis of your health</span>
        </h4>
        <div style={iconGalleryStyle}>
          <img src={iconGallery} />
        </div>
      </RW.Container>
    );
  }

  renderFirstProduct = (): JSX.Element => {
    return (
      <RW.Container style={mainContainerStyle}>
        <h3 style={headingStyle}>
          Our first product: a genetic report for ME/CFS.
          <br />
          For a limited time, get your personalized report for free.
        </h3>
        <img src={dnaImg} style={dnaImgStyle} />
        <div style={firstProductTextStyle}>
          We all have questions about our health. Precise.ly is the first service to deliver personalized
          insights from the world’s top health experts designed to help you understand and improve your health.
        </div>
        <RW.Link to="/report/me-cfs">
          <RW.Button style={reportButtonStyle} size="lg">Get Your Personalized Report Now</RW.Button>
        </RW.Link>
      </RW.Container>
    );
  }

  renderHowItWorksCol(icon: any, text: string) {
    return (
      <RW.Col md={{size: 4}} xs={{size: 12}}>
        <img src={icon} alt="" style={{height: '100px'}}/>
        <p className="pt-4" style={smallTextStyle}>
          {text}
        </p>
      </RW.Col>
    );
  }

  renderHowItWorks = (): JSX.Element => {
    const col1 = this.renderHowItWorksCol(upload23andMe, 'Upload your 23andMe data to Precise.ly. ' +
                                                         'Your data is secure and always under your control.');
    const col2 = this.renderHowItWorksCol(dnaMagnifier, 'Precise.ly performs computational analysis on millions of points in your genome, ' +
                                                        'and prepares details personalized reports for you.');
    const col3 = this.renderHowItWorksCol(clipboard, 'Check your email! Your report will be ready to view tomorrow.');
    return (
      <div className="pt-5 pb-4" style={{textAlign: 'center'}}>
        <h3 style={headingStyle}>
          How it works
        </h3>
        <div className="row mt-5" style={{width: '70%', margin: 'auto'}}>
          {col1} {col2} {col3}
        </div>
      </div>
    );
  }

}


const pageStyle: React.CSSProperties = {
  backgroundColor: Styles.colors.white,
  color: Styles.colors.defaultTextColor
};

const backgroundStyle: React.CSSProperties = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '500px',
  backgroundPosition: 'center',
};

const mainContainerStyle: React.CSSProperties = {
  paddingTop: '37px',
  paddingBottom: '50px',
};

const headingStyle: React.CSSProperties = {
  ...Styles.fonts.helvetica,
  fontSize: '40px',
  margin: '0px',
  fontWeight: 300
};

const dnaImgStyle: React.CSSProperties = {
  marginTop: '39px',
  marginBottom: '30px',
  height: '18px'
};

const titleStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  color: Styles.colors.preciselyGreen,
  backgroundColor: 'transparent',
  fontSize: '32px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center'
};

const smallTextStyle: React.CSSProperties = {
  ...Styles.fonts.helvetica,
  fontSize: '16px',
  color: Styles.colors.defaultTextColor
};

const firstProductTextStyle: React.CSSProperties = {
  ...smallTextStyle,
  marginBottom: '77px'
};

const reportButtonStyle: React.CSSProperties = {
  ...Styles.actionButtonStyle
};

const valuePropStyle: React.CSSProperties = {
  paddingTop: '39px',
  paddingBottom: '73px'
};

const iconGalleryStyle: React.CSSProperties = {
  marginTop: '30px',
  marginBottom: '24px'
};
