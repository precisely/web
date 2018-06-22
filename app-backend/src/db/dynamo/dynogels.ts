export * from '@aneilbaboo/dynogels-promisified';
import {Model, ModelConfiguration } from '@aneilbaboo/dynogels-promisified';
import * as dynogels from '@aneilbaboo/dynogels-promisified';
import {extend} from 'src/common/utils';
import {log} from 'src/common/logger';

const isOffline = process.env.ENV === 'offline';
// Use DynamoDB local if in offline mode
if (isOffline) {
  dynogels.AWS.config.update({
    region: 'localhost',
    endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT
  }, true);
}

export function stageTableName(tableName: string): string {
  let stage = process.env.STAGE;
  if (!stage) {
    log.warn('STAGE environment variable not set');
    stage = 'nostage';
  }
  return `${stage}-${tableName}`;
}

export function tableNameWithoutStage(tableNameWithEnv: string): string {
  const result = /[^-]*-(.*)/.exec(tableNameWithEnv);
  return result[1];
}

export function defineModel<Attributes, InstanceMethods = {}, StaticMethods = {}>(
  tableName: string,
  config: ModelConfiguration,
  staticMethods?: { new(): StaticMethods }
):
  Model<Attributes, InstanceMethods> & Partial<StaticMethods> {
  const fullName = stageTableName(tableName);
  const baseModel = dynogels.define<Attributes, InstanceMethods>(fullName, config);

  return extend(baseModel, staticMethods ? staticMethods.prototype : {});
}

export default dynogels;
