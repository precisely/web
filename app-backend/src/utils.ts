/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import * as Bluebird from 'bluebird';
import {log} from './logger';

type DecryptRequest = AWS.KMS.Types.DecryptRequest;
type DecryptResponse = AWS.KMS.Types.DecryptResponse;

const KMS: AWS.KMS = new AWS.KMS({ region: process.env.REGION as string });
const decryptAsync: (params: DecryptRequest) => Bluebird<Object> = Bluebird.promisify(KMS.decrypt.bind(KMS));

/*
 * Utility function to decrypt the variables stored in process.env
 */
export async function getEnvironmentVariables(): Promise<Object | void> {
  try {
    const result: DecryptResponse =
        await decryptAsync({CiphertextBlob: new Buffer(process.env.SECRETS as string, 'base64')});

    return result && result.Plaintext &&  JSON.parse(result.Plaintext.toString());
  } catch (error) {
    log.error(`Error while decrypting secrets: ${error.message}`);
    return null;
  }
}

// /**
//  * Utility function to check if a user is authorized or not.
//  */
// export function hasAuthorizedRoles(authorizer: AuthorizerAttributes, allowedRoles: string[]): boolean {
//   let isAuthorized: boolean = true;

//   if (!authorizer || !authorizer.claims || !authorizer.claims[`custom:roles`]) {
//     throw new Error('The user is unauthorized.');
//   }

//   const currentUserRoles: string[] = authorizer.claims[`custom:roles`].split(',');

//   isAuthorized = currentUserRoles.some((role: string): boolean => {
//     return (allowedRoles.indexOf(role.trim()) > -1);
//   });

//   if (!isAuthorized) {
//     throw new Error('The user is unauthorized.');
//   }

//   return isAuthorized;
// }

export function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U> first;
  if (second) {
    Object.keys(second).forEach(key => {
      first[key] = second[key];
    });
  }

  return result;
}
