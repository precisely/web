/*
 * Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import * as FontAwesome from 'react-fontawesome';
import {CSS} from 'src/interfaces';

@Radium
export class LoadingPage extends React.Component {

    render(): JSX.Element {
        return(
            <div style={loadingWrapper}>.
                <div style={{textAlign: 'center'}}>
                    <FontAwesome name="circle-o-notch" spin={true} size="3x" />
                    <h4 style={{fontSize: 20}}>Loading...</h4>
                </div>
            </div>
        );
    }
}

const loadingWrapper: CSS = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
};
