/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import Radium from 'radium';

import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';
import { ErrorPage } from 'src/features/common/ErrorPage';
import { Footer } from 'src/features/common/Footer';
import { Routes } from 'src/routes/Routes';


@Radium
export class BasePage extends React.Component<any, any> {

  render(): JSX.Element {
    return (
      <RW.Container fluid={true} style={baseContainerStyle}>
        <ErrorPage>
          <Routes />
        </ErrorPage>
        <Footer />
      </RW.Container>
    );
  }

}


const baseContainerStyle: Styles.ExtendedCSSProperties = {
  ...Styles.fonts.helvetica,
  color: Styles.colors.defaultTextColor,
  backgroundColor: Styles.colors.defaultBackground,
  fontWeight: 300,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  paddingLeft: '0px',
  paddingRight: '0px'
};
