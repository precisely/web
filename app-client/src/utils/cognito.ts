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

export const isLoggedIn = (): boolean => {
  return !!userPool.getCurrentUser();
};

export class AWSUser {
  jwtToken: string;
  user: CognitoUser;

  constructor() {
    AWS.config.setPromisesDependency(Bluebird);
    AWS.config.region = process.env.REACT_APP_AWS_CLIENT_REGION;
  }

   login = async (email: string , password: string) => {
    const userData: {Username: string, Pool: CognitoUserPool} = {
      Username : email,
      Pool : userPool
    };

    this.user = new CognitoUser(userData);

    const authenticationData: {Username: string, Password: string} = {
      Username : email,
      Password : password,
    };
    const authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationData);

    const authenticateUser: (params: AuthenticationDetails) => Bluebird<Object> =
            Bluebird.promisify(this.user.authenticateUser.bind(this.user));
    authenticateUser(authenticationDetails).then(this.setToken.bind(this));
  }

  async setToken(userSession: CognitoUserSession) {
    this.jwtToken = userSession.getIdToken().getJwtToken();
    setTokenInLocalStorage(this.jwtToken);
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : process.env.REACT_APP_USER_POOL_ID,
        Logins : {
            [`cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]: this.jwtToken,
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
  const userData: {Username: string, Pool: CognitoUserPool} = {
    Username : email,
    Pool : userPool
  };

  const cognitoUser: CognitoUser = new CognitoUser(userData);

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
  const userData: {Username: string, Pool: CognitoUserPool} = {
    Username : email,
    Pool : userPool
  };

  const cognitoUser: CognitoUser = new CognitoUser(userData);

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
