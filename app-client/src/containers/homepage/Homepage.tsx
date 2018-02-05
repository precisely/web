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
import {NavbarHeader} from 'src/components/NavbarHeader/NavbarHeader';
import {Container} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';

const dnaImg = require('src/assets/dna_sketch.png');

@Radium
export class Homepage extends React.Component<RouteComponentProps<void>, {fixed: boolean}> {

    state = {
        fixed: true,
    };

    // tslint:disable
    testScroll = (e: any): void => {
        if (window.scrollY > (window.innerHeight / 2)) {
            document.getElementById('homepage-section').scrollTo(0, 0);
            this.setState(() => ({
                fixed: false,
            }));
        } else {
            this.setState(() => ({
                fixed: true,
            }));
        }
    }

    componentDidMount(): void {
        window.addEventListener('scroll', this.testScroll, true);
    }

    render(): JSX.Element {
        const style = [parallaxStyle]

        if (this.state.fixed) {
            style.push(fixedBackground);
        }

        return (
            <div>
                <NavbarHeader {...this.props}/>
                <div style={style}>
                    <h1 style={{fontFamily: 'Lato, Open Sans', fontWeight: 300, fontSize: '3em'}}>
                        Do a deep dive on your DNA
                    </h1>
                    <h4 style={{fontFamily: 'Lato, Open Sans', fontWeight: 200}}>
                        Understand yourself like never before
                    </h4>
                </div>

                <div style={{height: '90vh', fontSize: '36px'}} id="homepage-section" onScroll={(e) => {this.testScroll(e)}}>
                    <Container className="pt-5 pb-4 text-center">
                        <h3 style={{fontFamily: 'Lato, Open Sans', fontWeight: 200}}>
                            Want to understand your health? Start here.
                        </h3>
                        <img src={dnaImg} className="mt-4 mb-4" height="70px"/>
                        <div className="lead" style={{fontSize: '0.4em'}}>
                            Our first product is for the ME/CFS community. By sequencing our DNA, we 
                            <br/> 
                            can tell you which gene variants you have that are common amingst people.
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

const fixedBackground: CSS = {
    backgroundAttachment: 'fixed',
};

const parallaxStyle: CSS = {
    backgroundImage: `url(${require('src/assets/asset.png')})`,
    height: '92vh',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textAlign: 'center',
    paddingTop: '8%',
    overflowY: 'auto'
};
