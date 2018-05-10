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

// tslint:disable
/* istanbul ignore next */
function LoadComponent(componentName: string, path?: string) {
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
            path="/"
            component={LoadComponent('Homepage', 'homepage/Homepage')}
            exact
        />
        <AuthRoute
            path="/view-report"
            component={LoadComponent('Report', 'report/Report')}
        />
        <Route
            path="/login"
            exact
            component={LoadComponent('Login', 'user/Login')}
        />
        <Route path="/about-us" exact component={LoadComponent('AboutUs', 'homepage/AboutUs')} />
        <Route path="*" component={LoadComponent('NotFound', 'common/NotFound')} />
      </Switch>
    );
  }
}
