/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as Radium from 'radium';
import * as React from 'react';

import * as Styles from 'src/constants/styles';
import { ErrorPage } from 'src/features/common/ErrorPage';
import { Footer } from 'src/features/common/Footer';
import { Routes } from 'src/routes/Routes';


@Radium
export class BasePage extends React.Component<any, any> {

  render(): JSX.Element {
    return (
      <div style={container}>
        <div style={routes}>
          <ErrorPage>
            <Routes />
          </ErrorPage>
        </div>
        <Footer />
      </div>
    );
  }

}


const container: React.CSSProperties = {
  ...Styles.fonts.helvetica,
  backgroundColor: Styles.colors.defaultBackground,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const routes: React.CSSProperties = {
  flex: '1 0 auto',
  width: '100%',
};
