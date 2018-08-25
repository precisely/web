import * as AuthUtils from 'src/utils/auth';
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';


function renderMergedProps(component:  React.ComponentClass<any> | React.StatelessComponent<any>, ...rest: any[]) {
  const finalProps = Object.assign({}, ...rest);
  const MergedComponent = component;
  return <MergedComponent {...finalProps} />;
}


interface AuthProps {
  component: React.ComponentClass<any> | React.StatelessComponent<any>;
  exact?: boolean;
  path: string;
}


export const AuthRoute = (authProps: AuthProps) => {
  const { component, ...rest } = authProps;

  function wrapRender(routeProps: any) {
    return AuthUtils.isAuthenticated() ? (
      renderMergedProps(authProps.component, routeProps, rest)
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: routeProps.location.pathname } }} />
    );
  }

  return (
    <Route {...rest} render={wrapRender} />
  );

};
