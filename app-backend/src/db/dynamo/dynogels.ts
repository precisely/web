import {SharedIniFileCredentials} from 'aws-sdk';
export * from '@aneilbaboo/dynogels-promisified';
import {Model, ModelConfiguration } from '@aneilbaboo/dynogels-promisified';
import * as dynogels from '@aneilbaboo/dynogels-promisified';
import {extend} from 'src/utils';

const options = {
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new SharedIniFileCredentials({ profile: process.env.PROFILE }),
  endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
};

// console.log('Starting dynogels with options:', options);

dynogels.AWS.config.update(options, true);

export function stageTableName(tableName: string): string {
  if (!process.env.STAGE) {
    throw new Error('STAGE environment variable not set');
  }
  return `${process.env.STAGE}-${tableName}`;
}

export function tableNameWithoutStage(tableNameWithEnv: string): string {
  const result = /[^-]*-(.*)/.exec(tableNameWithEnv);
  return result[1];
}

export function defineModel<Attributes, Methods = {}>(
  tableName: string,
  config: ModelConfiguration,
  methods?: Methods):
  Model<Attributes> & Methods {

  const fullName = stageTableName(tableName);
  const baseModel = dynogels.define<Attributes>(fullName, config);

  return extend(baseModel, methods);
}

export default dynogels;
