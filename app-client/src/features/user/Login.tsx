import * as Auth0 from 'auth0-js';
import * as AuthUtils from 'src/utils/auth';
import * as React from 'react';
import * as _ from 'lodash';
import { Redirect, RouteComponentProps} from 'react-router';
import { getEnvVar } from 'src/utils/env';
import { toast } from 'react-toastify';


const LS_AUTH_LOGIN_REDIRECT = 'auth-login-redirect';


export class Login extends React.Component<RouteComponentProps<void>> {

  webAuth = new Auth0.WebAuth({
    domain: 'dev-precisely.auth0.com',
    clientID: getEnvVar('REACT_APP_AUTH0_CLIENT_ID'),
    redirectUri: `${window.location.protocol}//${window.location.host}/login`,
    audience: 'https://dev-precisely.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  });


  saveLoginRedirect() {
    const to = _.get(this.props, ['location', 'state', 'from'], '/');
    localStorage.setItem(LS_AUTH_LOGIN_REDIRECT, to);
  }


  readLoginRedirect(): string {
    const to = localStorage.getItem(LS_AUTH_LOGIN_REDIRECT);
    localStorage.removeItem(LS_AUTH_LOGIN_REDIRECT);
    return to;
  }


  render(): JSX.Element {

    const webAuth = this.webAuth;

    if (AuthUtils.isAuthenticated()) {
      return (
        <Redirect to="/" />
      );
    }

    // the hash is set by a redirect back from Auth0's Universal Login and
    // indicates that authentication took place
    if (this.props.location.hash !== '' &&
        (/access_token|id_token|error/.test(this.props.location.hash))) {
      webAuth.parseHash(
        {hash: this.props.location.hash},
        (err, authResult) => {
          if (err) {
            toast.error('Error: ' + JSON.stringify(err, null, 2), { autoClose: false });
          }
          if (authResult && authResult.accessToken) {
            webAuth.client.userInfo(authResult.accessToken, (err, user) => {
              if (err) {
                toast.error('Error: ' + JSON.stringify(err, null, 2), { autoClose: false });
              }
              AuthUtils.saveAuthentication(authResult, user);
              const loginRedirect = this.readLoginRedirect();
              this.props.history.push(loginRedirect);
            });
          }
          return (
            <Redirect to="/" />
          );
        });
    }

    else {
      this.saveLoginRedirect();
      webAuth.authorize();
    }

    return null;

  }

}
