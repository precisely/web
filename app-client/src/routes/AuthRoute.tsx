/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { LoadableComponent } from 'react-loadable';
const {currentUser} = require('../constants/currentUser');

/* export class AuthRoute extends React.Component<RouteProps> {
  render(): JSX.Element {
    const routeProps: RouteProps = this.props;

    if (currentUser.isAuthenticated()) {
      utils.setLastPageBeforeLogin('');
      return <Route {...routeProps} />;
    }
    utils.setLastPageBeforeLogin(routeProps.path);
    return <Redirect from={routeProps.path} to={{pathname: '/login', state: {referrer: routeProps.path}}} />;
  }

} */

// tslint:disable-next-line
const renderMergedProps = (component:  React.ComponentClass<any> | React.StatelessComponent<any> & LoadableComponent, ...rest: any[]) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

interface AuthProps {
  // tslint:disable-next-line
  component: React.ComponentClass<any> | React.StatelessComponent<any> & LoadableComponent;
  exact?: boolean;
  path: string;
}

export const AuthRoute = (authProps: AuthProps) => {
  const {component, ...rest} = authProps;
  return (
    <Route 
        {...rest} 
        render={routeProps => {
          return currentUser.isAuthenticated() ? (
            renderMergedProps(authProps.component, routeProps, rest)
          ) : (
            <Redirect 
              to={{
                pathname: '/login',
                state: { from: routeProps.location }
              }}
            />
          );
        }}
    />
  );
};
