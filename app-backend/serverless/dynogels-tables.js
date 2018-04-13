
module.exports = () => {
  require('ts-node').register({module: "commonjs"});
  require('tsconfig-paths').register();
  const {dynogels} = require('../src/db/dynamo');
  const fs = require('fs');

  // force load models to populate dynogels.models
  require('../src/services/models');
  let params = {};
  const models = dynogels.models;

  for (const tableName in models) {
    if (models.hasOwnProperty(tableName)) {
      const model = models[tableName];
      params[tableName] = model.dynamoCreateTableParams({});
      params[tableName].Type = 'AWS::DynamoDB::Table';
    }
  }
  return params;
};