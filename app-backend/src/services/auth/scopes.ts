import {TypedError} from 'src/errors';
import { get as getNestedPath } from 'lodash';

type ScopeMatchType = '**' | true | false;

type ScopeContext = any; // tslint:disable-line

/**
 * Throws an error if the requestedScope symbol doesn't match the provided scopes
 * @param requestedScopeSymbol - E.g., "report:write:auth0|123123"
 * @param providedScopes  - processed form of scopes [['report','read','*'], ['variantCall','read','$userId']] etc.
 * @param context
 */
export function checkScope(requestedScopeSymbol: string, providedScopes: string[][], context: ScopeContext) {
  const requestedScope = makeScopes(requestedScopeSymbol)[0];
  const findPredicate = (scope: string[], index: number, obj: string[][]): boolean =>
    scopeMatches(requestedScope, scope, context);

  if (providedScopes.findIndex(findPredicate) === -1) {
    const error = new TypedError(`Access denied for ${requestedScope.join(':')}`, 'accessDenied');
    throw error;
  }
}

export function makeScopes(...scopeStrings: string[]): string[][] {
  return scopeStrings.map(s => s.split(':'));
}

function scopeMatches(requestedScope: string[], providedScope: string[], context: ScopeContext): boolean {
  let index;
  const minLength = Math.min(requestedScope.length, providedScope.length);
  for (index = 0; index < minLength; index++) {
    const requestedPart = requestedScope[index];
    const providedPart = providedScope[index];
    switch (scopePartMatches(requestedPart, providedPart, context)) {
      case '**':
        return true;
      case true:
        continue;
      case false:
        return false;
      default:
        return false;
    }
  }
  // must be of same length to be an exact match
  return requestedScope.length === providedScope.length;
}

function scopePartMatches(requestedPart: string, providedPart: string,  context: ScopeContext): ScopeMatchType {
  if (providedPart === requestedPart) {
    return true;
  } else if (providedPart === '**') {
    return '**';
  } else if (providedPart === '*') {
    return true;
  } else if (providedPart[0] === '$') {
    const contextKey = providedPart.slice(1);
    const contextValue = `${getNestedPath(context, contextKey)}`;
    return  contextValue === requestedPart;
  } else {
    return false;
  }
}
