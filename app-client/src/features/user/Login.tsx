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
import {NavigationBar} from 'src/features/common/NavigationBar';
import {header} from 'src/constants/styleGuide';
import { currentUser } from '../../constants/currentUser';
import history from 'src/routes/history';

@Radium
export class Login extends React.Component<RouteComponentProps<void>> {

  componentWillMount() {
    if (currentUser.isAuthenticated()) {
      history.goBack();
    }
  }
    
  render(): JSX.Element {

    return (
      <div>
        <NavigationBar {...this.props} />
        <h3 style={header}>Welcome back</h3>
      </div>
    );
  }
}
