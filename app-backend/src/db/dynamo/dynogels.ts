export * from '@aneilbaboo/dynogels-promisified';
import {Model, ModelConfiguration } from '@aneilbaboo/dynogels-promisified';
import * as dynogels from '@aneilbaboo/dynogels-promisified';
import {extend} from 'src/utils';

// Detect special 'offline' stage, use DynamoDB local
if (process.env.STAGE === 'offline') {
  dynogels.AWS.config.update({
    region: 'localhost',
    endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT
  }, true);
}

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
