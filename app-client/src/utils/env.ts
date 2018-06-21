import {isUndefined} from 'util';

export function getEnvVar(varName: string): string {
  const value = process.env[varName];
  if (isUndefined(value)) {
    throw new Error(`Environment variable ${varName} is undefined`);
  }
  return value;
}
