/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {Container, Link} from 'src/features/common/ReusableComponents';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {PageContent} from 'src/features/common/PageContent';
import {header} from 'src/constants/styleGuide';

@Radium
export class Dashboard extends React.Component<RouteComponentProps<void>> {

  /**
   * This is a dummy component for demonstration purpose only.
   * It will be removed in future.
   */

  render(): JSX.Element {
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>Dashboard</h1>
          <PageContent>
            <Link to="/view-report">Fetch dummy report</Link>
          </PageContent>
        </Container>
      </div>
    );
  }
}