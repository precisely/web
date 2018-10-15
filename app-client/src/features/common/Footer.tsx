/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {Col} from 'src/features/common/ReusableComponents';
import {helveticaFont} from 'src/constants/styleGuide';

type CSSProperties = React.CSSProperties;

@Radium
export class Footer extends React.Component {
  renderWithRealFooter() {
    return (
      <div className="pt-5 pb-5 text-center sticky-bottom" style={footerStyle}>
        <div className="row pt-2" style={{fontWeight: 300}}>
          <Col md={{size: 2, offset: 3}}>FAQ</Col>
          <Col md={{size: 2}}>Blog</Col>
          <Col md={{size: 2}}>Contact Us</Col>
        </div>
        <div className="row mt-2 pb-2" style={{color: '#808080', fontWeight: 100}}>
          <Col md={{size: 2, offset: 3}}>Privacy Policy</Col>
          <Col md={{size: 2}}>Terms of Service</Col>
          <Col md={{size: 2}}>&copy; 2017 Precise.ly</Col>
        </div>
      </div>
    );
  }
  render () {
    if (process.env.REACT_APP_LAUNCH_PAGE) {
      return (
        <div className="pt-5 pb-5 text-center sticky-bottom" style={footerStyle} />
      );
    }

    return this.renderWithRealFooter();
  }
}

const footerStyle: CSSProperties = {
  ...helveticaFont,
  backgroundColor: '#F5F5F5',
  fontSize: '1rem',
};
