const {dynogels} = require('../src/db/dynamo');
const fs = require('fs');

// force load models to populate dynogels.models
require('src/services/models');

// tslint:disable-next-line
let params = {};
const models = dynogels.models;
for (const tableName in models) {
  if (models.hasOwnProperty(tableName)) {
    const model = models[tableName];
    params[tableName] = model.dynamoParameters({});
    params[tableName].Type = 'AWS::DynamoDB::Table';
  }
}

const outputFile = process.argv[2];
if (!outputFile) {
  console.log('usage: ts-node write-dynogels-tables.ts {output}');
  console.log('write dynamo table definitions to output');
  process.exit(1);
}

fs.writeFileSync(outputFile, `
/**************************************************************
 * DO NOT MODIFY - THIS IS AN AUTOMATICALLY GENERATED FILE
 * ANY CHANGES YOU MAKE WILL BE OVERWRITTEN DURING DEPLOYMENT
 **************************************************************/
`);
fs.writeFileSync(outputFile, JSON.stringify(params, null, 2));
