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
const {currentUser} = require('../../constants/currentUser');
import { utils } from '../../utils';
import { loginAndSignupPanel, header } from '../../constants/styleGuide';

@Radium
export class Login extends React.Component<RouteComponentProps<void>> {

  componentDidMount() {
    if (currentUser.isAuthenticated()) {
      const lastLocation = utils.getLastPageBeforeLogin();
      this.props.history.push(lastLocation);
    } else {
      currentUser.showLogin();
    }
  }

  render(): JSX.Element {

    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="mx-auto" style={loginAndSignupPanel}>
          <h1 style={header}>Welcome back</h1>
        </div>
      </div>
    );
  }
}
