import { ParserError } from 'smart-report/lib/parser';

export class ReportContentError extends Error {
  constructor(public errors: ParserError[]) {
    super('Syntax errors found');
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, actualProto); 
    } else { 
      (<any> this).__proto__ = actualProto; // tslint:disable-line no-any
    } 
  }
}
