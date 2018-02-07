/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {CSS} from 'src/interfaces';
import {Row, Col} from 'src/components/ReusableComponents';

const logo = require('src/assets/logo.png');

export let SignupLoginContainer: React.StatelessComponent = props => (
    <div style={container}>
        <Row>
            <Col xs={12} style={formColumn}>
                <img style={logoStyle} src={logo} />
                {props.children}
            </Col>
        </Row>
    </div>
);

SignupLoginContainer = Radium(SignupLoginContainer);

const container: CSS = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    padding: 0,
};

const formColumn: CSS = {
    textAlign: 'center',
    padding: 0,
    '@media screen and (min-width: 600px)': {
        minWidth: '250px',
    }
};

const logoStyle: CSS = {
    height: '80px',
    marginBottom: '24px',
};