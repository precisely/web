/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import {Route, Redirect} from 'react-router-dom';
const {currentUser} = require('../constants/currentUser');

// tslint:disable-next-line
const renderMergedProps = (component:  React.ComponentClass<any> | React.StatelessComponent<any>, ...rest: any[]) => {
  const finalProps = Object.assign({}, ...rest);
  const MergedComponent = component;
  return <MergedComponent {...finalProps} />;
};

interface AuthProps {
  // tslint:disable-next-line
  component: React.ComponentClass<any> | React.StatelessComponent<any>;
  exact?: boolean;
  path: string;
}

export const AuthRoute = (authProps: AuthProps) => {
  const {component, ...rest} = authProps;
  return (
    <Route 
        {...rest} 
        render={ routeProps => {
          return currentUser.isAuthenticated() ? (
            renderMergedProps(authProps.component, routeProps, rest)
          ) : (
            <Redirect 
              to={{
                pathname: '/login',
                state: { from: routeProps.location.pathname }
              }}
            />
          );
        }}
    />
  );
};
