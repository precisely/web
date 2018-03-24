/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as AWS from 'aws-sdk';
import {setTokenInLocalStorage, removeTokenFromLocalStorage} from 'src/utils';
import * as Bluebird from 'bluebird';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  ISignUpResult,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

/* istanbul ignore next */
if (!process.env.REACT_APP_USER_POOL_ID || !process.env.REACT_APP_CLIENT_APP_ID) {
  console.warn('Cognito configuration missing.');
}

const poolData: {UserPoolId: string, ClientId: string} = {
  UserPoolId : process.env.REACT_APP_USER_POOL_ID,
  ClientId : process.env.REACT_APP_CLIENT_APP_ID,
};

export const userPool: CognitoUserPool = new CognitoUserPool(poolData);

export function configAWS() {
  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.region = process.env.REACT_APP_AWS_CLIENT_REGION;

}

export const isLoggedIn = (): boolean => {
  return !!userPool.getCurrentUser();
};

export class AWSUser {
  email: string;
  password: string;
  user: CognitoUser;

  constructor(email: string, password: string) {
    const userData: {Username: string, Pool: CognitoUserPool} = {
      Username : email,
      Pool : userPool
    };
    this.user = new CognitoUser(userData);
  }
  
  async login(email: string, password: string) {
    const authenticationData: {Username: string, Password: string} = {
      Username : email,
      Password : password,
    };
    const authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationData);
    
    const authenticateUser: (params: AuthenticationDetails) => Bluebird<Object> = 
            Bluebird.promisify(this.user.authenticateUser.bind(this));
    authenticateUser(authenticationDetails).then(this.setToken);
  }

  async setToken(userSession: CognitoUserSession) {
    let jwtToken: string = userSession.getIdToken().getJwtToken();
    setTokenInLocalStorage(jwtToken);
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : process.env.REACT_APP_USER_POOL_ID,
        Logins : {
            [`cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]: jwtToken,
        }
    });
  }

}




export function logOut(): void {
  const cognitoUser = userPool.getCurrentUser();
  cognitoUser.signOut();
  removeTokenFromLocalStorage();
}

export function getResetPasswordCode(
    email: string,
    successCallback?: () => void,
    failureCallback?: (message: string) => void
): void {
  const cognitoUser: CognitoUser = getCognitoUser(email);

  cognitoUser.forgotPassword({
    onSuccess: (): void => {
      if (successCallback) {
        successCallback();
      }
    },
    onFailure: (error: Error): void => {
      if (failureCallback) {
        failureCallback(error.message);
      }
    },
  });
}

export function resetPassword(
    email: string,
    verificationCode: string,
    newPassword: string,
    successCallback?: () => void,
    failureCallback?: (message: string) => void
): void {
  const cognitoUser: CognitoUser = getCognitoUser(email);

  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess(): void {
      if (successCallback) {
        successCallback();
      }
    },
    onFailure(error: Error): void {
      if (failureCallback) {
        failureCallback(error.message);
      }
    },
  });
}
