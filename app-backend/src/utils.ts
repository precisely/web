import * as AWS from 'aws-sdk';
import * as Bluebird from 'bluebird';

const KMS: AWS.KMS = new AWS.KMS({region: process.env.REGION as string});

export const decryptKMS = (encryptedKey: string): Bluebird<{}> => {
    return new Bluebird((
            resolve: (thenableOrResult?: {} | PromiseLike<{}>) => void, 
            reject: (error?: any) => void
    ): void => {
        KMS.decrypt({ CiphertextBlob: new Buffer(encryptedKey, 'base64')}, (
                err: Error, 
                data: AWS.KMS.Types.DecryptResponse
        ): void => {
            if(err) {
                reject(err)
            } else {
                resolve(data && data.Plaintext && JSON.parse(data.Plaintext.toString()))
            }
        })
    })
}
