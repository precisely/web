/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// A page with a navigation bar and standard layout
import * as React from 'react';
import { NavigationBar } from './NavigationBar';
import { Container } from './RadiumWrappers';

export class NavigationPage extends React.Component {

  render(): JSX.Element {
    return (
      <>
        <NavigationBar/>
        <Container className="mx-auto mt-5 mb-5">
          {this.props.children}
        </Container>
      </>
    );
  }
}
