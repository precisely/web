import * as AWS from 'aws-sdk';
import * as Bluebird from 'bluebird';

const KMS: AWS.KMS = new AWS.KMS({region: process.env.REGION as string});

export const decryptKMS = (encryptedKey: string): Bluebird<Object | Error> => {
    return new Bluebird((
            resolve: (thenableOrResult?: {} | PromiseLike<{}>) => void, 
            reject: (error?: any) => void
    ): void => {
        KMS.decrypt({CiphertextBlob: new Buffer(encryptedKey, 'base64')}, (
                error: Error, 
                data: AWS.KMS.Types.DecryptResponse
        ): void => {
            if(error) {
                reject(error)
            } else {
                resolve(data && data.Plaintext && JSON.parse(data.Plaintext.toString()))
            }
        })
    })
};
