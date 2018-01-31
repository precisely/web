/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

/**
 * A method to check if the given object is empty
 * @param object the JS object that needs to be checked
 * @returns boolean - true if object is empty, else false
 */
export function isEmpty(object: Object): boolean {
    return (!object || !Object.keys(object).length);
}

/**
 * A method to get the current NODE environment
 * @returns string - current NODE environment
 */
export function getEnvironment(): string {
    return process.env.NODE_ENV || '';
}

export const setTokenInLocalStorage = (token: string): boolean => {
    if (!token) {
        console.warn('No Token sent to setTokenInLocalStorage');
        return false;
    }

    localStorage.setItem('AUTH_TOKEN', token);

    return true;
};

export const removeTokenFromLocalStorage = (): void => {
    localStorage.removeItem('AUTH_TOKEN');
};
