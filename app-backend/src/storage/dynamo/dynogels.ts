import {SharedIniFileCredentials} from 'aws-sdk';
export * from 'dynogels-promisified';
import {Model, ModelConfiguration } from 'dynogels-promisified';
import * as dynogels from 'dynogels-promisified';
const pad = require('pad');

dynogels.AWS.config.update({
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new SharedIniFileCredentials({ profile: process.env.STAGE + '-profile-precisely' }),
  endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
}, true);

export function envTableName(tableName: string, version: number): string {
  return `${process.env.STAGE}-${pad(3, version, '0')}-${tableName}`;
}

function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U> first;
  if (second) {
    Object.keys(second).forEach(key => {
      first[key] = second[key];
    });
  }

  return result;
}

export function defineModel<Attributes, Methods = {}>(
  tableName: string,
  version: number,
  config: ModelConfiguration,
  methods?: Methods):
  Model<Attributes> & Methods {

  const fullName = envTableName(tableName, version);
  const baseModel = dynogels.define<Attributes>(fullName, config);

  return extend(baseModel, methods);
}

export default dynogels;
