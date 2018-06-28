/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// tslint:disable:jsx-boolean-value

import * as React from 'react';
import Loadable from 'react-loadable';
import {Route, Switch} from 'react-router-dom';
import {LoadingPage} from 'src/features/common/LoadingPage';
import { AuthRoute } from './AuthRoute';


function makeLoadable(componentName: string, path?: string) {
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
}


export class Routes extends React.Component {

  render(): JSX.Element {
    return (
      <Switch>
        <Route
            path="/"
            component={makeLoadable('Homepage', 'homepage/Homepage')}
            exact
        />
        <AuthRoute
            path="/view-report"
            component={makeLoadable('Report', 'report/Report')}
        />
        <Route
            path="/login"
            exact
            component={makeLoadable('Login', 'user/Login')}
        />
        <Route path="/login2"
               exact={true}
               component={makeLoadable('Login2', 'user/Login2')} />
        <Route path="/about-us" exact component={makeLoadable('AboutUs', 'homepage/AboutUs')} />
        <Route path="*" component={makeLoadable('NotFound', 'common/NotFound')} />
      </Switch>
    );
  }

}
