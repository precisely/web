import {
  CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerCallback, CustomAuthorizerResult,
  PolicyDocument, Statement, Context
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { Genotype } from 'src/services/models';

const PolicyVersion = '2012-10-17';
export const DynamoReadActions = [
  'dynamodb:Query',
  'dynamodb:Scan',
  'dynamodb:GetItem',
  'dynamodb:BatchGetItem'
];

export const DynamoWriteActions = [
  'dynamodb:PutItem',
  'dynamodb:BatchPutItem'
];

function dynamoTableUserAccessStatement (
  userId: string,
  tableName: string,
  action: string | string[],
  region: string = '*',
  accountId: string = '*'): Statement {
  return {
    Effect: 'Allow',
    Action: action,
    Resource: `arn:aws:dynamodb:${region}:${accountId}:table/${tableName}`,
    Condition: {
      'ForAllValues:StringEquals': {
        'dynamodb:LeadingKeys': [ userId ]
      }
    }
  };
}

function s3FolderUserAccessStatements(userId: string, bucket: string): Statement[] {
  return [{
    Sid: 'AllowAllS3ActionsInUserFolder',
    Effect: 'Allow',
    Action: 's3:*',
    Resource: `aws:arn:s3:::${bucket}/${userId}/*`
  }, {
    Sid: 'AllowListingObjectsInS3UserFolder',
    Effect: 'Allow',
    Action: 's3:ListBucket',
    Resource: `aws:arn:s3:::${bucket}`,
    Condition: {
      'StringEquals': {
        's3:prefix': `${userId}/*`
      }
    }
  }];
}

const LambdaExecutionPolicyStatement: Statement = {
  Sid: 'AllowUserToExecuteFunctions',
  Effect: 'Allow',
  Action: [ 'lambda:Invoke', 'lambda:InvokeAsync' ],
  Resource: `aws:arn:lambda:::*`,
};

export const userAuthorizer: CustomAuthorizerHandler =
    async (event: CustomAuthorizerEvent, context: Context, callback: CustomAuthorizerCallback) => {
    // no need to verify
    const decodedAuthToken = <{ claims: { sub: string} }> jwt.decode(event.authorizationToken, {complete: true});
    const userId = decodedAuthToken.claims.sub;
    const policy: PolicyDocument = {
      Version: PolicyVersion,
      Statement: [
        LambdaExecutionPolicyStatement,
        dynamoTableUserAccessStatement(userId, Genotype.tableName(), DynamoReadActions),
        // in future:
        // dynamoTableUserAccessStatement(userId, SurveyResults.tableName(), DynamoWriteActions + DynamoReadActions),
        ... s3FolderUserAccessStatements(userId, process.env.S3_BUCKET_GENETICS_VCF),
        ... s3FolderUserAccessStatements(userId, process.env.S3_BUCKET_GENETICS_23ANDME)
      ]
    };
    const result: CustomAuthorizerResult = {
      principalId: userId,
      policyDocument: policy,
      context: {} // TODO: add user info
    };

    callback(null, result);
};
