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
import { utils } from '../../utils';
const logo = require('src/assets/logo.png');
export class Login extends Component<RouteComponentProps<void>> {
  lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_TENANT,
    {
      theme: {
        logo: logo,
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

  state = {
    isLoggedIn: false
  };

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
    utils.setAuthStorage(
      authResult.accessToken,
      (new Date().getTime() + authResult.expiresIn * 1000).toString(),
      JSON.stringify(authResult)
    );
    this.setState({isLoggedIn: true});
    this.props.history.push(utils.getLastPageBeforeLogin());
  }

  render(): JSX.Element {
    
    // Avoid showing Lock when hash is parsed.
    if (!(/access_token|id_token|error/.test(this.props.location.hash)) && !this.state.isLoggedIn) {
      this.lock.show();
    }
    return null;
  }
}
