/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {WhitePage} from 'src/features/common/WhitePage';
type CSSProperties = React.CSSProperties;
import { NavigationPage } from '../common/NavigationPage';

@Radium
export class AboutUs extends React.Component<RouteComponentProps<void>> {

  render(): JSX.Element {
    return (
      <NavigationPage {...this.props}>
        <WhitePage>
          <h2 style={pageHeader}>About Us</h2>
          <h5 style={subHeader}>The story behind Precise.ly</h5>
          <p style={paragraph}>We started out Curious, we’re now Precise.ly.</p>
          <p style={paragraph}>
            Our mission: to provide a platform for individuals to gather and track their personal
            data. We believe this is the only path toward precision health. Technologies for
            generating many kinds of personal data are on the rise but what does it all mean?
            Our goal is to provide the tools to bring it all together for you, and share with
            others who can help derive meaning from it.
          </p>
          <p style={paragraph}>
            And now, we’re bringing on personal genomics, focused on delivering a better
            understanding the genetic underpinnings of chronic conditions.
          </p>
          <p style={paragraph}>
            Through our recently announced partnership with Helix (more on this below), we’re
            delivering a deep dive into the genetics of chronic diseases. Patients can combine
            their disease-specific genetic data with other details—symptoms, treatment
            response—and be connected to researchers and clinicians who are experts in their
            disease. They can connect other patients who share their disease ‘subtype,’
            based on the data they’ve accrued.
          </p>
          <p style={{...paragraph, marginBottom: '55px'}}>
            We also firmly believe the data our customers assemble is theirs to control and
            share as they see fit.
          </p>
        </WhitePage>
      </NavigationPage>
    );
  }
}


const fontWeight: CSSProperties = {
  fontWeight: 200,
};

const pageHeader: CSSProperties = {
  ...fontWeight,
  fontSize: '40px',
  marginTop: '-3px',
};

const subHeader: CSSProperties = {
  ...fontWeight,
  fontSize: '20px',
  letterSpacing: '1px',
  marginTop: '-5px',
  marginBottom: '20px',
};

const paragraph: CSSProperties = {
  textAlign: 'left',
  fontSize: '16px',
  ...fontWeight,
};
