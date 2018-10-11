/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-10-06 05:38:39
 * @Last Modified by:   Aneil Mallavarapu
 * @Last Modified time: 2018-10-06 05:38:39
 */

import * as React from 'react';
import * as Radium from 'radium';
import * as FontAwesome from 'react-fontawesome';
import {Link} from 'src/features/common/ReusableComponents';
type CSSProperties = React.CSSProperties;

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

const container: CSSProperties = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FAFCD6',
};

const contentWrapper: CSSProperties = {
  textAlign: 'center',
};

const fontColor: CSSProperties = {
  fontSize: '100px',
  color: '#259F6C',
};

const linkStyle: CSSProperties = {
  color: '#1E6B7F',
};

const message: CSSProperties = {
  color: '#1E6B7F',
};
