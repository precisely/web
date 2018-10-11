/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {Footer} from 'src/features/common/Footer';
import {Routes} from 'src/routes/Routes';
import {defaultBackground, helveticaFont} from 'src/constants/styleGuide';

type CSSProperties = React.CSSProperties;

export class BasePage extends React.Component<any, any> {

  render(): JSX.Element {
    return (
      <div style={container}>
        <div style={routes}>
          <Routes />
        </div>
        <Footer />
      </div>
    );
  }
}

const container: CSSProperties = {
  ...helveticaFont,
  backgroundColor: defaultBackground,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const routes: CSSProperties = {
  flex: '1 0 auto',
  width: '100%',
};
