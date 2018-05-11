type ErrorType = 'accessDenied' | 'unknown' | 'fileError';

export class TypedError extends Error {
  type?: ErrorType;
  constructor(message: string, type: ErrorType = 'unknown') {
    super(message);
    this.type = type;
  }
}
