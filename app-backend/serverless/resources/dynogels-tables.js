/**
 * Generates serverless DynamoDB table resource definitions and permissions
 * {
 *   definitions: {
 *     DynamoTableGenotype: {
 *       Type: "AWS::DynamoDB::Table",
 *       Properties: {
 *         ...
 *       }
 *     }, ...
 *   }
 *   permissions: {
 *     Genotype: {
 *       read: {
 *         Effect: "Allow",
 *         Action: [ "dynamodb:Query", "dynamodb:GetItem", ... ],
 *         Resource: [ ... ] // objects which construct various resource ARNs
 *       }
 *       write: {
 *         ...
 *       }
 *     }
 *   }
 * }
 */
require('ts-node').register({module: "commonjs"});
require('tsconfig-paths').register();

function buildServerlessResources() {
  const {dynogels, tableNameWithoutStage, listTableNames} = require('src/db/dynamo');
  const {upperFirst, camelCase} = require('lodash');

  const DynamoDBReadPermissions = [ 'dynamodb:Query', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:BatchGetItem' ];
  const DynamoDBWritePermissions = [ 'dynamodb:PutItem', 'dynamodb:BatchPutItem' ];

  // force load models to populate dynogels.models
  require('src/services/models');

  function tableResourceArns(serverlessResourceName) {
    const tableArn = { "Fn::GetAtt": [ serverlessResourceName, 'Arn' ] };
    return [
      tableArn,
      { "Fn::Join": [ "", [tableArn, "/index/*" ]] },
      { "Fn::Join": [ "", [tableArn, "/stream/*" ]] }
    ];
  }

  let definitions = {};
  let permissions = {};
  const models = dynogels.models;
  
  listTableNames().forEach(tableName => {
    const model = models[tableName];
    const uppercaseTableName = upperFirst(camelCase(tableNameWithoutStage(tableName)));
    const serverlessResourceName = `DynamoTable${uppercaseTableName}`;
    definitions[serverlessResourceName] = {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        ... model.dynamoCreateTableParams({ billingMode: 'PAY_PER_REQUEST' })
      }
    };
    permissions[uppercaseTableName] = {
      read: {
        Effect: 'Allow',
        Action: DynamoDBReadPermissions,
        Resource: tableResourceArns(serverlessResourceName)
      },
      write: {
        Effect: 'Allow',
        Action: DynamoDBWritePermissions,
        Resource: tableResourceArns(serverlessResourceName)
      }
    }
    
  });
  return { definitions, permissions };
}

module.exports.Definitions = () => buildServerlessResources().definitions;
module.exports.Permissions = () => buildServerlessResources().permissions;