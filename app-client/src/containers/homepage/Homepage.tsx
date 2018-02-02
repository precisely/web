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
import {NavbarHeader} from 'src/components/Navbar';

const logo = require('src/assets/asset.png');

@Radium
export class Homepage extends React.Component<RouteComponentProps<void>, void> {
    render(): JSX.Element {
        return (
            <div>
                <NavbarHeader/>
                <div style={{textAlign: 'center'}}>
                    <h1 style={{fontFamily: 'Lato, Open Sans', fontWeight: 300, fontSize: '3em'}}>
                        Do a deep dive on your DNA
                    </h1>
                    <h4 style={{fontFamily: 'Lato, Open Sans', fontWeight: 200}}>
                        Understand yourself like never before
                    </h4>
                </div>
                <img src={logo} style={{width: '100%'}}/>
            </div>
        );
    }
}