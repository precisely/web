/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import {Route, RouteProps, Redirect} from 'react-router-dom';
import { utils } from '../utils';
const {currentUser} = require('../constants/currentUser');

export class AuthRoute extends React.Component<RouteProps> {
  render(): JSX.Element {
    const routeProps: RouteProps = this.props;

    if (currentUser.isAuthenticated()) {
      utils.setLastPageBeforeLogin('');
      return <Route {...routeProps} />;
    }
    utils.setLastPageBeforeLogin(routeProps.path);
    return <Redirect from={routeProps.path} to={'/login'} />;
  }
}
