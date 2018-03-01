/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {toast, ToastType} from 'react-toastify';

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

export const getTokenFromLocalStorage = (): string => {
    let token: string = localStorage.getItem('AUTH_TOKEN');
    return token || '';
};

export const removeTokenFromLocalStorage = (): void => {
    localStorage.removeItem('AUTH_TOKEN');
};

export const showAlert = (toastId: number, message: string, alertType?: ToastType): number => {
    const type: ToastType = alertType || 'error';
    if (!toast.isActive(toastId)) {
        toastId = toast[type](message);
    } else {
        toast.update(toastId, {render: message, type: type});
    }

    return toastId;
};

export const validateEmailAndPassword = (
        email: string,
        password: string,
        toastId: number,
): {isValid: boolean, toastId: number} => {
    if (!email.trim() && !password) {
        toastId = showAlert(toastId, 'Email and Password are required.');
        return {isValid: false, toastId};
    }

    if (!email.trim()) {
        toastId = showAlert(toastId, 'Email is required.');
        return {isValid: false, toastId};
    }

    if (!password) {
        toastId = showAlert(toastId, 'Password is required.');
        return {isValid: false, toastId};
    }

    if (password.length < 6) {
        toastId = showAlert(toastId, 'Password should contain atleast 6 characters.');
        return {isValid: false, toastId};
    }

    return {isValid: true, toastId};
};
