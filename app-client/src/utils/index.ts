/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {toast, ToastType} from 'react-toastify';

export const utils = {

  isEmpty: function(object: Object): boolean {
    return (!object || !Object.keys(object).length);
  },

  getEnvironment: function(): string {
    return process.env.NODE_ENV || '';
  },

  checkEmailAndPassword: function(
      email: string,
      password: string,
      toastId: number
  ): {isValid: boolean, toastId: number} {
    let validationInfo: {isValid: boolean, toastId: number} = {isValid: true, toastId};

    if (!email.trim() && !password) {
      toastId = this.showAlert(toastId, 'Email and Password are required.');
      validationInfo = {isValid: false, toastId};
    }

    if (validationInfo.isValid) {
      validationInfo = this.validateEmail(email, toastId);
    }

    if (validationInfo.isValid) {
      validationInfo = this.validatePassword(password, toastId);
    }

    return validationInfo;
  },

  setTokenInLocalStorage: function(token: string): boolean {
    if (!token) {
      console.warn('No Token sent to setTokenInLocalStorage');
      return false;
    }

    localStorage.setItem('AUTH_TOKEN', token);

    return true;
  },

  getTokenFromLocalStorage: function(): string {
    let token: string = localStorage.getItem('AUTH_TOKEN');
    return token || '';
  },

  removeTokenFromLocalStorage: function(): void {
    localStorage.removeItem('AUTH_TOKEN');
  },

  showAlert: function(toastId: number, message: string, alertType?: ToastType): number {
    const type: ToastType = alertType || 'error';
    if (!toast.isActive(toastId)) {
      toastId = toast[type](message);
    } else {
      toast.update(toastId, {render: message, type: type});
    }

    return toastId;
  },

  validateEmail: function(email: string, toastId: number): {isValid: boolean, toastId: number} {
    if (!email.trim()) {
      toastId = this.showAlert(toastId, 'Email is required.');
      return {isValid: false, toastId};
    }

    return {isValid: true, toastId};
  },

  validatePassword: function(password: string, toastId: number): {isValid: boolean, toastId: number} {
    if (!password) {
      toastId = this.showAlert(toastId, 'Password is required.');
      return {isValid: false, toastId};
    }

    if (password.length < 6) {
      toastId = this.showAlert(toastId, 'Password should contain atleast 6 characters.');
      return {isValid: false, toastId};
    }

    return {isValid: true, toastId};
  }

};
