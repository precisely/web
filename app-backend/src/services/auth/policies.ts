import { Statement, PolicyDocument } from 'aws-lambda';
import {Genotype} from 'src/services/genotype/models';

export const PolicyVersion = '2012-10-17';
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

export const LambdaExecutionPolicyStatement: Statement = {
  Sid: 'AllowUserToExecuteFunctions',
  Effect: 'Allow',
  Action: [ 'lambda:Invoke', 'lambda:InvokeAsync' ],
  Resource: `aws:arn:lambda:::*`,
};

/**
 * Create a user policy document
 *
 * @export
 * @param {string} userId - the user whose resources are being requested
 * @param {boolean} admin - if provided, permissions allowed for all users' resources
 * @returns {PolicyDocument}
 */
export function userPolicyDocument(userId: string, admin: boolean): PolicyDocument {
  if (admin) {
    // Open access for admins so they can use API (esp in development)
    // TODO: need to lock this down for prod
    return {
      Version: PolicyVersion,
      Statement: [
        LambdaExecutionPolicyStatement,
        dynamoTableUserAccessStatement(null, Genotype.tableName(), [...DynamoReadActions,  ...DynamoWriteActions]),
        // in future:
        // dynamoTableUserAccessStatement(userId, SurveyResults.tableName(), DynamoWriteActions + DynamoReadActions),
        ... s3FolderUserAccessStatements(null, process.env.S3_BUCKET_GENETICS_VCF),
        ... s3FolderUserAccessStatements(null, process.env.S3_BUCKET_GENETICS_23ANDME)
      ]
    };
  } else {
    return {
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
  }
}

export function dynamoTableUserAccessStatement (
  userId: string,
  tableName: string,
  action: string | string[],
  region: string = '*',
  accountId: string = '*'): Statement {
  const condition = userId ? {
    Condition: {
      'ForAllValues:StringEquals': {
        'dynamodb:LeadingKeys': [ userId ]
      }
    }
   } : {};

  return {
    Effect: 'Allow',
    Action: action,
    Resource: `arn:aws:dynamodb:${region}:${accountId}:table/${tableName}`,
    ...condition
  };
}

export function s3FolderUserAccessStatements(userId: string, bucket: string): Statement[] {
  const condition = userId ? { Condition: {
    'StringEquals': {
      's3:prefix': `${userId}/*`
    }
  }} : {};

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
    ...condition
  }];
}
