import * as React from 'react';
const Loadable = require('react-loadable'); // avoid the typings. They are a mess: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/19337
import { AuthRoute } from './AuthRoute';
import { LoadingPage } from 'src/features/common/LoadingPage';
import { Route, Switch } from 'react-router-dom';
import { NotFoundError } from 'src/errors/display-error';

function makeLoadable(componentName: string, path?: string, extraProps: Object = {}) {
  return Loadable({
    loader: () => import('src/features/' + (path || componentName)),
    render(loaded: any, props: any) {
      const Component: React.ComponentClass<any> = loaded[`${componentName}`];
      return <Component {...props} {...extraProps}/>;
    },
    loading() {
      return <LoadingPage />;
    }
  });
}

const NotFoundErrorComponent = () => {
  throw new NotFoundError();
};

export class Routes extends React.Component {

  render(): JSX.Element {
    if (process.env.REACT_APP_LAUNCH_PAGE === 'true') {
      return (
        <Switch>
          <Route path="/" exact={true}
                component={makeLoadable('LaunchPage', 'homepage/LaunchPage')} />
          <Route path="*" component={NotFoundErrorComponent} />
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
        <AuthRoute path="/surveys" exact={true}
                   component={makeLoadable('SurveyList', 'survey/SurveyList')} />
        <Route path="*" component={NotFoundErrorComponent} />
      </Switch>
    );
  }
}
