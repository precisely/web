import {SharedIniFileCredentials} from 'aws-sdk';
export * from 'dynogels-promisified';
import {Model, ModelConfiguration } from 'dynogels-promisified';
import * as dynogels from 'dynogels-promisified';
import {extend} from 'src/utils';

const options = {
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new SharedIniFileCredentials({ profile: process.env.STAGE + '-profile-precisely' }),
  endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
};

console.log('Starting dynogels with options:', options);

dynogels.AWS.config.update(options, true);

export function envTableName(tableName: string): string {
  return `${process.env.STAGE}-${tableName}`;
}

export function tableNameWithoutEnv(tableNameWithEnv: string): string {
  const result = /[^-]*-(.*)/.exec(tableNameWithEnv);
  return result[1];
}

export function defineModel<Attributes, Methods = {}>(
  tableName: string,
  config: ModelConfiguration,
  methods?: Methods):
  Model<Attributes> & Methods {

  const fullName = envTableName(tableName);
  const baseModel = dynogels.define<Attributes>(fullName, config);

  return extend(baseModel, methods);
}

export default dynogels;
