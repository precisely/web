/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import Radium from 'radium';
// import * as FontAwesome from 'react-fontawesome';
type CSSProperties = React.CSSProperties;
const loadingGif = require('src/assets/custom/precisely-loading.gif');


@Radium
export class LoadingPage extends React.Component {

  render(): JSX.Element {
    return(
      <div style={loadingWrapper}>
        <div style={{textAlign: 'center'}}>
          <img src={loadingGif} style={{height: '100px', width: '100px'}}/>
          {/* <FontAwesome name="circle-o-notch" spin={true} size="3x" /> */}
        </div>
      </div>
    );
  }
}


const loadingWrapper: CSSProperties = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
