
// yes, this is duplicative of what is in common.js, but I am paranoid
export const isOffline = !process.env.STAGE || !/^(no|0|false|)$/i.test(process.env.IS_OFFLINE || '');
export const inServerlessProcess = !!process.env.IN_SERVERLESS_PROCESS;

import {isUndefined} from 'util';

export function getEnvVar(varName: string): string {
  const value = process.env[varName];
  if (isUndefined(value)) {
    throw new Error(`Environment variable ${varName} is undefined`);
  }
  return value;
}
