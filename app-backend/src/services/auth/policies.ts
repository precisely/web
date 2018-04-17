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

export function userPolicyDocument(userId: string): PolicyDocument {
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

export function dynamoTableUserAccessStatement (
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

export function s3FolderUserAccessStatements(userId: string, bucket: string): Statement[] {
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

export const LambdaExecutionPolicyStatement: Statement = {
  Sid: 'AllowUserToExecuteFunctions',
  Effect: 'Allow',
  Action: [ 'lambda:Invoke', 'lambda:InvokeAsync' ],
  Resource: `aws:arn:lambda:::*`,
};
