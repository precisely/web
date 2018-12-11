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

// Used to generate
const AutoscalingSettings = {
  VariantCall: [{
    index: true,  // true means "all global secondary indexes"
                  // otherwise an array of global secondary index names which should inherit this setting
                  // or undefined / []
    indexOnly: false, // if true, the settings below only apply to the indexes
    read: {
      minimum: 5,
      maximum: 3000
    },
    write: {
      minimum: 5,
      maximum: 3000
    }
  }],
  // Report: { // 
  // },
  // SystemVariantRequirement: { // 
  // },
  // UserSample:
  default: [{
    index: true,
    indexOnly: false,
    read: {
      minimum: 5,     
      maximum: 1000,    
      usage: 0.75
    },
    write: {
      minimum: 40,
      maximum: 200,
      usage: 0.5  
    }
  }]
};

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
  let autoscaling = [];

  listTableNames().forEach(tableName => {
    const model = models[tableName];
    const uppercaseTableName = upperFirst(camelCase(tableNameWithoutStage(tableName)));
    const serverlessResourceName = `DynamoTable${uppercaseTableName}`;
    definitions[serverlessResourceName] = {
      Type: 'AWS::DynamoDB::Table',
      Properties: model.dynamoCreateTableParams({})
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
    
    autoscaling = autoscaling.concat(autoscalingSettingsForTable(uppercaseTableName, serverlessResourceName, model.schema.globalIndexes));

  });
  return { definitions, permissions, autoscaling };
}

function autoscalingSettingsForTable(tableName, resourceName, globalIndexes) {
  const settings = AutoscalingSettings[tableName] || AutoscalingSettings.default;
  const globalIndexNames = Object.keys(globalIndexes);
  return settings.map(entry => ({
      ...entry,
      index: entry.index === true ? globalIndexNames : entry.index,
      table: resourceName
    })
  );
}

module.exports.Definitions = () => buildServerlessResources().definitions;
module.exports.Permissions = () => buildServerlessResources().permissions;
module.exports.Autoscaling = () => buildServerlessResources().autoscaling;