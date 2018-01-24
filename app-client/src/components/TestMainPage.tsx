/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import Anime, {AnimeProps} from 'react-anime';

const logo: string = require('../assets/logo.png');

@Radium
export class TestMainPage extends React.Component<{}, {}> {
    render(): JSX.Element {
        return (
            <div style={mainPageStyle}>
                <Anime {...logoAnimationOptions}>
                    <img src={logo} />
                    <h3>CauseCode Technologies</h3>
                    <code>react-mobile-starter</code>
                </Anime>
            </div>
        );
    }
}

const logoAnimationOptions: AnimeProps = {
    marginTop: ['-100px', '100px'],
    duration: 2000,
    easing: 'easeOutElastic',
    elasticity: 400
};

const mainPageStyle: React.CSSProperties = {
    backgroundColor: '#fafafa',
    padding: '25px 15px',
    textAlign: 'center',
    fontSize: '22px'
};
