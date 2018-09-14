import {ReducibleElement, ReducibleTagElement} from 'smart-report';
import * as AWS from 'aws-sdk';
/**
 * 
 * @param attrs 
 * @param props 
 */
export function ensureAttributes<T extends object, K extends keyof T>(
  tagName: string, attrs: T, ...props: K[]
): Pick<Required<T>, K> {
  for (const prop of props) {
    if (!attrs.hasOwnProperty(prop)) {
      throw new Error(`Expecting attribute ${prop} in ${tagName}`);
    }
  }
  return <Pick<Required<T>, K>> attrs; 
}
