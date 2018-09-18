import * as React from 'react';
import Loadable from 'react-loadable';
import { AuthRoute } from './AuthRoute';
import { LoadingPage } from 'src/features/common/LoadingPage';
import { Route, Switch } from 'react-router-dom';


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
    if (process.env.REACT_APP_LAUNCH_PAGE === 'true') {
      console.log('detected launch environment');
      return (
        <Switch>
          <Route path="/" exact={true}
                component={makeLoadable('LaunchPage', 'homepage/LaunchPage')} />
          <Route path="*" component={makeLoadable('NotFound', 'common/NotFound')} />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/" exact={true}
              component={makeLoadable('HomePage', 'homepage/HomePage')} />
        <Route path="/login" exact={true}
              component={makeLoadable('Login', 'user/Login')} />
        <Route path="/about-us" exact={true}
              component={makeLoadable('AboutUs', 'homepage/AboutUs')} />
        <AuthRoute path="/report/:slug" exact={true}
                  component={makeLoadable('Report', 'report/Report')} />
        <Route path="*" component={makeLoadable('NotFound', 'common/NotFound')} />
      </Switch>
    );
  }
}
