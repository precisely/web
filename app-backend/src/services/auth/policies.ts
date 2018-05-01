import { Statement, PolicyDocument } from 'aws-lambda';
import {Genotype} from 'src/services/genotype/models';
import {camelCase} from 'lodash';

export function adminPolicyDocument(): PolicyDocument {
  // Open access for admins so they can use API (esp in development)
  // TODO: need to lock this down for prod
  return {
    Version: PolicyVersion,
    Statement: [
      ...PublicPolicyStatements,
      dynamoTableUserAccessStatement(null, Genotype.tableName(), [...DynamoReadActions,  ...DynamoWriteActions]),
      // in future:
      // dynamoTableUserAccessStatement(userId, SurveyResults.tableName(), DynamoWriteActions + DynamoReadActions),
      ... s3FolderUserAccessStatements(null, process.env.S3_BUCKET_GENETICS_VCF),
      ... s3FolderUserAccessStatements(null, process.env.S3_BUCKET_GENETICS_23ANDME)
    ]
  };
}

export function userPolicyDocument(userId: string): PolicyDocument {
  return {
    Version: PolicyVersion,
    Statement: [
      ...PublicPolicyStatements,
      apiAllowInvokePolicyStatement({method: 'POST', path: process.env.GRAPHQL_API_PATH}),
      dynamoTableUserAccessStatement(userId, Genotype.tableName(), DynamoReadActions),
      // in future:
      // dynamoTableUserAccessStatement(userId, SurveyResults.tableName(), DynamoWriteActions + DynamoReadActions),
      ... s3FolderUserAccessStatements(userId, process.env.S3_BUCKET_GENETICS_VCF),
      ... s3FolderUserAccessStatements(userId, process.env.S3_BUCKET_GENETICS_23ANDME)
    ]
  };
}

export function publicPolicyDocument(): PolicyDocument {
  return {
    Version: PolicyVersion,
    Statement: PublicPolicyStatements
  };
}

//
//
//
//  Support methods and definitions
//
//
//

/**
 * Generates invoke policy
 * @export
 * @param {string} method - http verb
 * @param {string} path - e.g., "api"
 * @returns {Statement}
 */
export function apiAllowInvokePolicyStatement(
  {method, path, region= '*', accountId= '*', apiId= '*'}:
  {method: string, path: string, region?: string, accountId?: string, apiId?: string}
): Statement {
  method = method ? method.toUpperCase() : 'GET';
  return {
    Effect: 'Allow',
    Action: [ 'execute-api:Invoke' ],
    Resource: [
      `arn:aws:execute-api:${process.env.REGION}:${accountId}:${apiId}/*/${method}${path}`,
    ]
  };
}

/**
 * Create a user policy document
 *
 * @export
 * @param {string} userId - the user whose resources are being requested
 * @param {boolean} admin - if provided, permissions allowed for all users' resources
 * @returns {PolicyDocument}
 */
export function policyDocument(userId: string, admin: boolean): PolicyDocument {
  // admin policy
  if (admin) {
   return adminPolicyDocument();
  } else if (userId) {
    // authenticated User policy
    return userPolicyDocument(userId);
  } else {
    return publicPolicyDocument();
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
  const bucketCamelCase = camelCase(bucket);
  return [{
    Sid: `AllowAllS3ActionsInUserFolder${bucketCamelCase}`,
    Effect: 'Allow',
    Action: 's3:*',
    Resource: `arn:aws:s3:::${bucket}/${userId}/*`
  }, {
    Sid: `AllowListingObjectsInS3UserFolder${bucketCamelCase}`,
    Effect: 'Allow',
    Action: 's3:ListBucket',
    Resource: `arn:aws:s3:::${bucket}`,
    ...condition
  }];
}

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

// TODO: lock this down - it currently allows all lambdas to be invoked
export const LambdaExecutionPolicyStatement: Statement = {
  Sid: 'PreciselyUserAllowExecuteFunctions',
  Effect: 'Allow',
  Action: [ 'lambda:InvokeFunction', 'lambda:InvokeAsync' ],
  Resource: 'arn:aws:lambda:::*',
};

export const LogPolicyStatement: Statement = {
  Sid: 'AllowLogging',
  Effect: 'Allow',
  Action: [
    'logs:PutLogEvents',
    'logs:CreateLogGroup',
    'logs:CreateLogStream'
  ],
  Resource: '*'
};

export const CloudWatchPolicyStatement: Statement = {
  Sid: 'AllowCloudWatchLogWriting',
  Effect: 'Allow',
  Action: [
    'cloudwatch:*' // TODO: tighten this up!
  ],
  Resource: '*'
};

const STSAllowStatement = {
  Effect: 'Allow',
  Action: 'sts:AssumeRole',
  Resource: '*'
  // Principal: { Service: [ 'lambda.amazonaws.com', 'apigateway.amazonaws.com' ] }
};

const PublicPolicyStatements = [
  STSAllowStatement,
  CloudWatchPolicyStatement,
  LambdaExecutionPolicyStatement,
  LogPolicyStatement,
  apiAllowInvokePolicyStatement({method: 'GET', path: process.env.GRAPHQL_API_PATH}),
];

export const CrazyOpenAccessPolicyDocument = {
  Version: PolicyVersion,
  Statement: [{
    Effect: 'Allow',
    Action: [ '*' ],
    Resource: [ '*' ]
  }]
};
