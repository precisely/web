/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Radium from 'radium';
import * as FontAwesome from 'react-fontawesome';
import {Link} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';

@Radium
export class NotFound extends React.Component {

  render(): JSX.Element {
    return (
      <div style={container}>
        <div style={contentWrapper}>
          <FontAwesome name="exclamation-triangle" style={fontColor} />
          <h4 style={message}>Oops! Seems like you have reached no man's land.</h4>
          <Link to="/login" style={linkStyle}>Please start over</Link>
        </div>
      </div>
    );
  }
}

const container: CSS = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FAFCD6',
};

const contentWrapper: CSS = {
  textAlign: 'center',
};

const fontColor: CSS = {
  fontSize: '100px',
  color: '#259F6C',
};

const linkStyle: CSS = {
  color: '#1E6B7F',
};

const message: CSS = {
  color: '#1E6B7F',
};
