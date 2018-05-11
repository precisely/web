/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import {Route, Redirect, RouteProps} from 'react-router-dom';
import { utils } from '../utils';
const {currentUser} = require('../constants/currentUser');

export interface AuthRouteProps extends RouteProps {
  authenticatedRedirect?: string;
}

export class AuthRoute extends React.Component<AuthRouteProps> {
  render(): JSX.Element {
    const routeProps: RouteProps = this.props;
    const {authenticatedRedirect} = this.props;

    if (currentUser.isAuthenticated()) {
      return authenticatedRedirect ? 
          <Redirect from={routeProps.path} to={authenticatedRedirect} /> :
          <Route {...routeProps} />;
    }

    if (routeProps.path.indexOf('login')) {
      utils.setLastPageBeforeLogin(routeProps.path);
      return <Redirect from={routeProps.path} to="/login" />;
    }

    return <Route {...routeProps} />;
  } 
}
