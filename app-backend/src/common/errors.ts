type ErrorType = 'accessDenied' | 'unknown' | 'fileError';

export class TypedError extends Error {
  type?: ErrorType;
  constructor(message: string, type: ErrorType = 'unknown') {
    super(message);
    this.type = type;
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, actualProto); 
    } else { 
      (<any> this).__proto__ = actualProto; // tslint:disable-line no-any
    } 
  }
}
