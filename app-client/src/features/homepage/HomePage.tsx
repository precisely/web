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
import { helveticaThinFont, preciselyMagenta, preciselyGreen, white, offWhite, helveticaFont,  defaultTextColor } from 'src/constants/styleGuide';
import { Container, Col } from 'src/features/common/ReusableComponents';
import { NavigationBar } from 'src/features/common/NavigationBar';
import {Button} from 'reactstrap';
import { Link } from '../common/ReusableComponents';

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
export class HomePage extends React.Component<RouteComponentProps<void>> {

  // componentDidMount() {
  //   document.body.style.backgroundColor = white;
  // }

  render(): JSX.Element {
    return (
      <div style={{backgroundColor: white, color: defaultTextColor}}>
        <NavigationBar {...this.props}/>
        <ParallaxProvider>
          <h1 style={{...titleStyle, color: preciselyGreen, backgroundColor: 'transparent'}}>
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

  smallTextStyle(): CSSProperties {
    return {...helveticaFont, color: defaultTextColor};
  }

  renderSlab(content: JSX.Element, alternateColor: boolean = false) {
    return (
      <div style={{position: 'relative', textAlign: 'center', backgroundColor: alternateColor ? offWhite : white}}>
        {content}
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

  renderFirstProduct = (): JSX.Element => {
    return (
      <Container className="pt-5 pb-4">
        <h3 style={headingStyle}>
          Our first product: a genetic report for ME/CFS
        </h3>
        <h3 style={headingStyle}>
          For a limited time, get your personalized report for free.
        </h3>
        <img src={dnaImg} style={{maxWidth: '100%', maxHeight: '100%' }}/>
        <div className="lead row" style={this.smallTextStyle()}>
          <p>We all have questions about our health. Precise.ly is the first service to deliver personalized
              insights from the world’s top health experts designed to help you understand and improve your health.
          </p>
        </div>
        {/* FIXME: I have no idea how to properly style a button with a link */}
        <Link to="/report/mecfs">
          <Button style={{backgroundColor: preciselyMagenta}} size="lg">Get Your Personalized Report Now</Button>
        </Link>
      </Container>
    );
  }

  renderHowItWorksCol(icon: any, text: string) {
    return (
      <Col md={{size: 4}} xs={{size: 12}}>
        <img src={icon} alt="" style={{height: '100px'}}/>
        <p className="pt-4" style={this.smallTextStyle()}>
          {text}
        </p>
      </Col>
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

  renderMoreInformation = (): JSX.Element => {
    return (
      <Container className="pt-5 pb-4 ">
        <h3 style={headingStyle}>
          Third Section of the website
        </h3>
        <img src={dnaImg} className="mt-4 mb-4" height="70px"/>
        <div className="lead row" style={{fontSize: '0.4em', textAlign: 'justify'}}>
          <Col md={{size: 6, offset: 3}}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Col>
        </div>
      </Container>
    );
  }
}

const backgroundStyle: CSSProperties = {
  backgroundImage: `url(${faces})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '500px',
  backgroundPosition: 'center',
};

const headingStyle: CSSProperties = {
  ...helveticaFont,
  fontWeight: 300
};

const titleStyle: React.CSSProperties = {
  ...helveticaThinFont,
  fontSize: '32px',
  fontWeight: 50,
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'center',
  color: '#00bc3e'
};
