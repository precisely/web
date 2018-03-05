/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as AWS from 'aws-sdk';
import {setTokenInLocalStorage, removeTokenFromLocalStorage} from 'src/utils';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser,
    CognitoUserSession,
    ISignUpResult,
    CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

if (!process.env.REACT_APP_USER_POOL_ID || !process.env.REACT_APP_CLIENT_APP_ID) {
    console.warn('Cognito configuration missing.');
}

const poolData: {UserPoolId: string, ClientId: string} = {
    UserPoolId : process.env.REACT_APP_USER_POOL_ID,
    ClientId : process.env.REACT_APP_CLIENT_APP_ID,
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

export const isLoggedIn = (): boolean => {
    return !!userPool.getCurrentUser();
};

export const getCognitoUser = (email: string): CognitoUser => {
    const userData: {Username: string, Pool: CognitoUserPool} = {
        Username : email,
        Pool : userPool
    };

    return new CognitoUser(userData);
};

export function login(
    email: string,
    password: string,
    successCallback?: () => void,
    failureCallback?: (message: string) => void
): void {
    const authenticationData: {Username: string, Password: string} = {
        Username : email,
        Password : password,
    };

    const authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser: CognitoUser = getCognitoUser(email);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession): void => {
            setTokenInLocalStorage(result.getIdToken().getJwtToken());

            AWS.config.region = process.env.REACT_APP_AWS_CLIENT_REGION;

            const jwtToken: string = result.getIdToken().getJwtToken();
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : process.env.REACT_APP_USER_POOL_ID,
                Logins : {
                    [`cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]: jwtToken,
                }
            });

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

export function signup(
        email: string,
        password: string,
        successCallback?: (result: ISignUpResult) => void,
        failureCallback?: (message: string) => void
): void {
    const userRole: CognitoUserAttribute = new CognitoUserAttribute({Name: 'custom:roles', Value: 'USER'});

    userPool.signUp(
            email,
            password,
            [userRole],
            null,
            (error: Error, result: ISignUpResult): void => {
        if (error) {
            if (failureCallback) {
                failureCallback(error.message);
            }

            return;
        }

        if (successCallback) {
            successCallback(result);
        }
    });
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
