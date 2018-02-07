import * as AWS from 'aws-sdk';
import * as Bluebird from 'bluebird';

const KMS: AWS.KMS = new AWS.KMS({region: process.env.REGION as string});

/*
 * Utility function to decrypt the variables stored in process.env
 */
export const getEnvironmentVariables = (): Bluebird<Object | Error> => {
    return new Bluebird((
            resolve: (thenableOrResult?: {} | PromiseLike<{}>) => void, 
            reject: (error?: any) => void
    ): void => {
        KMS.decrypt({CiphertextBlob: new Buffer(process.env.SECRETS as string, 'base64')}, (
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
