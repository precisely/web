/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as AWS from 'aws-sdk';
import {push} from 'react-router-redux';
import {setTokenInLocalStorage, removeTokenFromLocalStorage} from 'src/utils';
import {store} from 'src/store';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser,
    CognitoUserSession,
    ISignUpResult,
} from 'amazon-cognito-identity-js';

if (!process.env.REACT_APP_USER_POOL_ID || !process.env.REACT_APP_CLIENT_APP_ID) {
    console.warn('Cognito configuration missing.');
}

const poolData: {UserPoolId: string, ClientId: string} = {
    UserPoolId : process.env.REACT_APP_USER_POOL_ID,
    ClientId : process.env.REACT_APP_CLIENT_APP_ID,
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

export function login(
    email: string,
    password: string,
    successCallback?: () => void,
    failureCallback?: () => void
): void {
    const authenticationData: {Username: string, Password: string} = {
        Username : email,
        Password : password,
    };

    const authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationData);

    const userData: {Username: string, Pool: CognitoUserPool} = {
        Username : email,
        Pool : userPool
    };

    const cognitoUser: CognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession): void => {
            setTokenInLocalStorage(result.getIdToken().getJwtToken());

            AWS.config.region = 'us-east-1';

            const jwtToken: string = result.getIdToken().getJwtToken();
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : process.env.REACT_APP_USER_POOL_ID,
                Logins : {
                    [`cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]: jwtToken,
                }
            });

            store.dispatch(push('/dashboard'));

            if (successCallback) {
                successCallback();
            }
        },

        onFailure: (): void => {
            if (failureCallback) {
                failureCallback();
            }
        },
    });
}

export function signup(email: string, password: string): void {
    userPool.signUp(email, password, null, null, (error: Error, result: ISignUpResult): void => {
        if (error) {
            console.log('error', error);
            return;
        }

        console.log('user name is ' + result.user.getUsername());
    });
}

export function logOut(): void {
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    removeTokenFromLocalStorage();
}