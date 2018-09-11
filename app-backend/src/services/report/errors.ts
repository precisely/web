import { ParserError } from 'smart-report/lib/parser';

export class ReportContentError extends Error {
  constructor(public errors: ParserError[]) {
    super(`Report content syntax errors found (${errors.length}): ${printableErrors(errors)}`);
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, actualProto); 
    } else { 
      (<any> this).__proto__ = actualProto; // tslint:disable-line no-any
    } 
  }
}

function printableErrors(errors: ParserError[]) {
  return errors.map(e => 
    `${e.message} [${e.type}] at ${e.location.lineNumber}:${e.location.columnNumber}`
  ).join('; ');
}
