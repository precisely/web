import {dynogels} from 'src/db/dynamo';
require('src/modules/models');

let params: {[key: string]: {} | object | string | number} = {};
const models = dynogels.models;
for (const tableName in models) {
  if (Object.hasOwnProperty(tableName)) {
    const model = models[tableName];
    params[tableName] = model.makeTableCreateParams();
    params.Type = 'AWS::DynamoDB::Table';
  }
}

console.log(JSON.stringify(params, null, 2));
