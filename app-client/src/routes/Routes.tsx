/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import Loadable from 'react-loadable';
import {Route, Switch} from 'react-router-dom';
import {AuthRoute} from 'src/routes/AuthRoute';
import {LoadingPage} from 'src/features/common/LoadingPage';
import {isLoggedIn} from 'src/utils/cognito';

// tslint:disable
/* istanbul ignore next */
const LoadComponent = (componentName: string, path?: string) =>  {
  return Loadable({
    loader: () => import('src/features/' + (path || componentName)),
    render(loaded: any, props: any) {
      const Component: React.ComponentClass<any> = loaded[`${componentName}`];

      return <Component {...props} />;
    },
    loading() {
      return <LoadingPage />;
    }
  });
};
// tslint:enable

/* istanbul ignore next */
export class Routes extends React.Component {

  render(): JSX.Element {
    return (
      <Switch>
        <AuthRoute
            onEnter={() => !isLoggedIn()}
            redirectTo="/dashboard"
            path="/"
            exact
            component={LoadComponent('Homepage', 'homepage/Homepage')}
        />
        <AuthRoute
            onEnter={() => !isLoggedIn()}
            redirectTo="/dashboard"
            path="/login"
            exact
            component={LoadComponent('Login', 'user/Login')}
        />
        <AuthRoute
            onEnter={() => !isLoggedIn()}
            redirectTo="/dashboard"
            path="/signup"
            exact
            component={LoadComponent('Signup', 'user/Signup')}
        />
        <AuthRoute
            onEnter={isLoggedIn}
            redirectTo="/login"
            path="/dashboard"
            exact
            component={LoadComponent('Dashboard', 'user/Dashboard')}
        />
        <AuthRoute
            onEnter={() => !isLoggedIn()}
            redirectTo="/dashboard"
            path="/reset-password/:email"
            exact
            component={LoadComponent('ResetPassword', 'user/ResetPassword')}
        />
        <AuthRoute
            onEnter={() => !isLoggedIn()}
            redirectTo="/dashboard"
            path="/forgot-password"
            exact
            component={LoadComponent('ForgotPassword', 'user/ForgotPassword')}
        />
        <AuthRoute
            onEnter={isLoggedIn}
            redirectTo="/login"
            path="/view-report"
            exact
            component={LoadComponent('Report', 'report/Report')}
        />
        <Route path="/about-us" exact component={LoadComponent('AboutUs', 'homepage/AboutUs')} />
        <Route path="*" component={LoadComponent('NotFound', 'common/NotFound')} />
      </Switch>
    );
  }
}
