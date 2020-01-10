/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import Radium from 'radium';

import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';


@Radium
export class Footer extends React.Component {

  renderWithRealFooter() {
    const year = (new Date()).getFullYear();
    return (
      <div className="pt-5 pb-5 text-center sticky-bottom" style={footerStyle}>
        <div className="row">
          <RW.Col className="pl-4 pr-4 col-md-auto">
            <RW.Link to="/contact-us">Contact Us</RW.Link>
          </RW.Col>
          <RW.Col className="pl-4 pr-4 col-md-auto">
            <RW.Link to="/privacy-policy">Privacy Policy</RW.Link>
          </RW.Col>
          <RW.Col className="pl-4 pr-4 col-md-auto">
            <RW.Link to="/tos">Terms of Service</RW.Link>
          </RW.Col>
          <RW.Col className="pl-4 pr-4 col-md-auto">
            <RW.Link to="/">&copy; {year} Precise.ly</RW.Link>
          </RW.Col>
        </div>
      </div>
    );
  }

  render () {
    return this.renderWithRealFooter();
  }

}


const footerStyle: React.CSSProperties = {
  ...Styles.fonts.helvetica,
  backgroundColor: '#F5F5F5',
  fontSize: '1rem',
  marginLeft: 'auto',
  marginRight: 'auto'
};
