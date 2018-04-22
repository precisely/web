module.exports = () => {
  require('ts-node').register({module: "commonjs"});
  require('tsconfig-paths').register();
  const {dynogels, tableNameWithoutStage} = require('src/db/dynamo');
  const {capitalize, camelCase} = require('lodash');
  const fs = require('fs');

  // force load models to populate dynogels.models
  require('src/services/models');
  let params = {};
  const models = dynogels.models;

  for (const tableName in models) {
    if (models.hasOwnProperty(tableName)) {
      const model = models[tableName];
      const uppercaseTableName = capitalize(camelCase(tableNameWithoutStage(tableName)));
      const serverlessResourceName = `DynamoTable${uppercaseTableName}`;
      params[serverlessResourceName] = {
        Type: 'AWS::DynamoDB::Table',
        Properties: model.dynamoCreateTableParams({})
      };
    }
  }
  return params;
};