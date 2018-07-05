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

    return (
      <Switch>
        <AuthRoute path="/report" exact={true}
                   component={makeLoadable('Report', 'report/Report')} />
        <Route path="/" exact={true}
               component={makeLoadable('Homepage', 'homepage/Homepage')} />
        <Route path="/login" exact={true}
               component={makeLoadable('Login', 'user/Login')} />
        <Route path="/about-us" exact={true}
               component={makeLoadable('AboutUs', 'homepage/AboutUs')} />
        <Route path="*" component={makeLoadable('NotFound', 'common/NotFound')} />
      </Switch>
    );

  }

}
