import { fromPairs } from 'lodash';
import { GraphQLError } from 'graphql';

export interface DisplayErrorResolution {
  link?: { url: string, text: string };
}

export interface StdDisplayErrorArgs {
  graphQLError?: GraphQLError;
  resolution?: DisplayErrorResolution;
  description?: string;
}

export abstract class DisplayError extends Error {
  public name: string;
  public resolution?: DisplayErrorResolution;
  public description?: string;

  constructor({ message, description, name, resolution }: {
    message: string, resolution: DisplayErrorResolution, name: string, description: string
  }) {
    super(message);
    this.name = name;
    this.resolution = resolution;
    this.description = description;

    const actualProto = new.target.prototype;
    const _this: any = this; // tslint:disable-line 
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      _this.__proto__ = actualProto;
    }
  }
}

export class AuthenticationError extends DisplayError {
  constructor({ description, graphQLError, resolution }: StdDisplayErrorArgs = {}) {
    super({
      description,
      message: 'Authentication Required',
      name: 'authentication',
      resolution: resolution || {
        link: { url: '/login', text: 'Login' }
      }});
  }
}

export class NotFoundError extends DisplayError {
  constructor({ description, graphQLError, resolution }: StdDisplayErrorArgs = {}) {
    super({
      description, resolution,
      message: 'Not Found',
      name: 'not_found'
    });
  }
}

export class AccessDeniedError extends DisplayError {
  constructor({ description, graphQLError, resolution }: StdDisplayErrorArgs = {}) {
    super({
      description, resolution,
      message: 'Access Denied',
      name: 'access_denied'
    });
  }
}

export class UnknownError extends DisplayError {
  constructor({ description, graphQLError, resolution }: StdDisplayErrorArgs = {}) {
    super({
      description, resolution,
      message: 'Unknown Error',
      name: 'unknown'
    });
  }
}

export class NetworkError extends DisplayError {
  constructor({ description, graphQLError, resolution }: StdDisplayErrorArgs = {}) {
    super({
      description, resolution,
      message: 'Network Error',
      name: 'network'
    });
  }
}

// a map from names to error classes
export const DisplayErrorClasses = fromPairs([
  AuthenticationError,
  NotFoundError,
  AccessDeniedError,
  UnknownError,
  NetworkError].map(e => [new e({}).name, e]));

