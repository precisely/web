/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
import Auth0Lock from 'auth0-lock';
import {Component} from 'react';
import {authLockButtonBackground} from 'src/constants/styleGuide';
import { RouteComponentProps} from 'react-router';
import * as AuthUtils from 'src/utils/auth';

const LOGO = require('src/assets/logo.png');
const KEY_FOR_LAST_PATH_BEFORE_LOGIN = 'lastPathBeforeLogin';

export class Login extends Component<RouteComponentProps<void>> {
  lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_TENANT,
    {
      theme: {
        logo: LOGO,
        primaryColor: authLockButtonBackground
      },
      languageDictionary: {
        title: 'Precise.ly'
      },
      auth: {
        responseType: 'token id_token',
        params: {
          scope: 'openid profile'
        }
      }
    }
  );

  // tslint:disable-next-line
  constructor(props: any) {
    super(props);
    this.lock.on('authenticated', this.onAuthentication);
    this.lock.on('authorization_error', (error: Error) => {
      // TODO - Need to add error reporting
      // tslint:disable-next-line
      console.log('something went wrong', error.message);
    });
  }

  onAuthentication = (authResult: AuthResult) => {
    this.saveAuthenticationInfo(authResult);
    this.redirectAfterLogin();
  }

  redirectAfterLogin() {
    const lastPath = this.getLastPathBeforeLogin();
    this.saveLastPath(null);
    this.props.history.push(lastPath);
  }

  saveAuthenticationInfo (authResult: AuthResult) {
    AuthUtils.saveToken(authResult.accessToken, authResult.expiresIn);
  }

  saveLastPath (path: string | null) {
    if (path) {
      localStorage.setItem(KEY_FOR_LAST_PATH_BEFORE_LOGIN, path);
    }
    localStorage.removeItem(KEY_FOR_LAST_PATH_BEFORE_LOGIN);
  }
  
  getLastPathBeforeLogin() {
    const lastPage = localStorage.getItem(KEY_FOR_LAST_PATH_BEFORE_LOGIN);
    return lastPage ? lastPage : '/';
  }

  render(): JSX.Element {
    // Avoid showing Lock when hash is parsed.
    if (!(/access_token|id_token|error/.test(this.props.location.hash)) && !AuthUtils.isAuthenticated()) {
      if (this.props.location.state) {
        this.saveLastPath(this.props.location.state.from);
      }
      this.lock.show();
    } 
    return null;
  }
}
