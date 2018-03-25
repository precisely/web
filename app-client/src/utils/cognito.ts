/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {setTokenInLocalStorage, removeTokenFromLocalStorage} from 'src/utils';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

/* istanbul ignore next */
if (!process.env.REACT_APP_USER_POOL_ID || !process.env.REACT_APP_CLIENT_APP_ID) {
  console.warn('Cognito configuration missing.');
}

export class AWSUser {
  user: CognitoUser;
  authenticationDetails: AuthenticationDetails;
  userPool: CognitoUserPool;
  poolData: {UserPoolId: string, ClientId: string};

  constructor() {
    this.poolData = {
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      ClientId: process.env.REACT_APP_CLIENT_APP_ID
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  signup(
    email: string,
    password: string,
    successCallback: (result: ISignUpResult) => void,
    failureCallback: (error: Error) => void
  ): void {

    this.userPool.signUp(
        email,
        password,
        null,
        null,
        (error: Error, result: ISignUpResult): void => {
          if (error) {
            failureCallback(error);
            return;
          }
          successCallback(result);
        }
    );
  }

  login (
      email: string , 
      password: string,
      onSuccess: (cognitoUserSession: CognitoUserSession) => void,
      onFailure: () => void
  ) {
    this.buildCognitoUser(email);
    const authenticationData: {Username: string, Password: string} = {
      Username : email,
      Password : password,
    };
    this.authenticationDetails = new AuthenticationDetails(authenticationData);
    return this.user.authenticateUser(
        this.authenticationDetails, 
        { 
          onSuccess: onSuccess, 
          onFailure: onFailure
        });  
  }

  static setToken(userSession: CognitoUserSession) {
    let jwtToken: string = userSession.getIdToken().getJwtToken();
    setTokenInLocalStorage(jwtToken);
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : process.env.REACT_APP_USER_POOL_ID,
        Logins : {
            [`cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]: jwtToken,
        }
    });
  }

  isLoggedIn(): boolean {
    return !!this.userPool.getCurrentUser();
  }

  logOut(): void {
    const cognitoUser = this.userPool.getCurrentUser();
    cognitoUser.signOut();
    removeTokenFromLocalStorage();
  }

  forgotPassword (
    email: string,
    // tslint:disable-next-line
    successCallback: (data: any) => void,
    failureCallback: (error: Error) => void
  ): void {
    this.buildCognitoUser(email);
    this.user.forgotPassword({
      onSuccess: successCallback,
      onFailure: failureCallback
    });
  }

  resetPassword(
    email: string,
    verificationCode: string,
    newPassword: string,
    successCallback: () => void,
    failureCallback: (error: Error) => void
  ): void {
    this.buildCognitoUser(email);
    this.user.confirmPassword(
      verificationCode, newPassword, 
      {
        onSuccess: successCallback,
        onFailure: failureCallback
      }
    );
  }

  private buildCognitoUser(email: string) {
    this.user = new CognitoUser({
      Username : email,
      Pool : this.userPool
    });
  }

}
