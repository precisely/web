/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import * as Bluebird from 'bluebird';

type DecryptRequest = AWS.KMS.Types.DecryptRequest;
type DecryptResponse = AWS.KMS.Types.DecryptResponse;

const KMS: AWS.KMS = new AWS.KMS({ region: process.env.REGION as string });
const decryptAsync: (params: DecryptRequest) => Bluebird<Object> = Bluebird.promisify(KMS.decrypt.bind(KMS));

/*
 * Utility function to decrypt the variables stored in process.env
 */
export async function getEnvironmentVariables(): Promise<Object | void> {
    try {
        const result: DecryptResponse = await decryptAsync({CiphertextBlob: new Buffer(process.env.SECRETS as string, 'base64')});
        return result && result.Plaintext &&  JSON.parse(result.Plaintext.toString());
    } catch (error) {
        console.log('Error while decrypting secrets:', error.message);
        return null;
    }
}