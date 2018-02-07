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
import {Footer} from 'src/components/Footer';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {Container, Col} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {HelveticaFont} from 'src/constants/styleGuide';

const scrollParallax = require('react-scroll-parallax');
const Parallax = scrollParallax.Parallax;
const ParallaxProvider = scrollParallax.ParallaxProvider;
const asset = require('src/assets/asset.png');
const dnaImg = require('src/assets/dna_sketch.png');
const mailbox = require('src/assets/mailbox.png');
const clipboard = require('src/assets/clipboard.png');
const shoppingCart = require('src/assets/shopping-cart.png');

@Radium
export class Homepage extends React.Component<RouteComponentProps<void>> {

    render(): JSX.Element {
        return (
            <div>
                <NavigationBar {...this.props}/>
                <ParallaxProvider>
                    <div style={containerStyle}>
                        <Parallax offsetYMin="-50%" offsetYMax="40%" slowerScrollRate>
                            <div style={imageStyle}/>
                        </Parallax>
                        <div style={parallaxChildren}>
                            <h1 style={[headingStyle, {fontWeight: 300, fontSize: '3.5em'}]}>
                                Do a deep dive on your DNA
                            </h1>
                            <h4 style={headingStyle}>
                                Understand yourself like never before
                            </h4>
                        </div>
                    </div>
                </ParallaxProvider>
                <div style={homepageSection} className="text-center">
                    <Container className="pt-5 pb-4">
                        <h3 style={headingStyle}>
                            Want to understand your health? Start here.
                        </h3>
                        <img src={dnaImg} className="mt-4 mb-4" height="70px"/>
                        <div className="lead row" style={{fontSize: '0.4em', textAlign: 'justify'}}>
                            <Col md={{size: 6, offset: 3}}>
                                <p>Our first product is for the ME/CFS community. By sequencing your DNA, 
                                we can tell you which gene variants you have that are common amongst 
                                people with ME/CFS, and which ones you don’t.</p> 
                                <br/>
                                <p>This knowledge can help you evaluate treatment options with your doctor. 
                                If you have ME/CFS, check out our report at Helix.com. </p>
                            </Col>
                        </div>
                    </Container>
                    <div className="pt-5 pb-4" style={{backgroundColor: '#F5F5F5'}}>
                        <h3 style={headingStyle}>
                            How it works
                        </h3>
                        <div className="row mt-5" style={{width: '70%', margin: 'auto'}}>
                            <Col md={{size: 4}} xs={{size: 12}}>
                                <img src={shoppingCart} alt=""/>
                                <p className="pt-4" style={{fontSize: '0.9rem', fontWeight: 100}}>
                                    Order our ME/CFS panel on Helix.com. 
                                    You’ll receive a saliva sample tube in the mail about 10 days later.
                                </p>
                            </Col>
                            <Col md={{size: 4}} xs={{size: 12}}>
                                <img src={mailbox} alt=""/>
                                <p className="pt-4" style={{fontSize: '0.9rem', fontWeight: 100}}>
                                    Simply spit in the saliva sample turb and return it in the pre-stamped, 
                                    pre-addressed package and mail it.
                                </p>
                            </Col>
                            <Col md={{size: 4}} xs={{size: 12}}>
                                <img src={clipboard} alt=""/>
                                <p className="pt-4" style={{fontSize: '0.9rem', fontWeight: 100}}>
                                    We’ll notify you by email once we’ve finished sequencing your DNA. 
                                    Just click the link in the email to create your account and view your ME/CFS report.
                                </p>
                            </Col>
                        </div>
                    </div>
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
                </div>
                <Footer />
            </div>
        );
    }
}

const containerStyle: CSS = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
};

const imageStyle: CSS = {
    backgroundImage: `url(${asset})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '150vh',
    backgroundPosition: 'center',
};

const parallaxChildren: CSS = {
    position: 'absolute',
    top: '10%',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    textAlign: 'center',
};

const headingStyle: CSS = {
    ...HelveticaFont, 
    fontWeight: 200
};

const homepageSection: CSS = {
    fontSize: '36px'
};
