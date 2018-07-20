import * as https from 'https';

import {Model, ModelConfiguration} from '@aneilbaboo/dynogels-promisified';
import * as dynogels from '@aneilbaboo/dynogels-promisified';

import {extend} from 'src/common/utils';
import {log} from 'src/common/logger';
import {isOffline, inServerlessProcess} from 'src/common/environment';

export {Model, ModelConfiguration, ListenerNextFunction} from '@aneilbaboo/dynogels-promisified';
export * from '@aneilbaboo/dynogels-promisified';

// Use DynamoDB local if in offline mode
if (isOffline) {
  const dynamoEndpoint = process.env.DYNAMODB_LOCAL_ENDPOINT || 'http://localhost:8000';
  dynogels.AWS.config.update({
    credentials: new dynogels.AWS.Credentials({
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy'
    }),
    region: 'us-east-1',
    endpoint: dynamoEndpoint
  }, true);

  if (!inServerlessProcess) {
    log.info(`Using offline dynamodb at ${dynamoEndpoint}`);
  }
} else {
  if (!inServerlessProcess) {
    log.info(`Using AWS cloud hosted DynamoDB`);
    // To improve the efficiency of DynamoDB requests
    dynogels.AWS.config.update({
      httpOptions: {
        agent: new https.Agent({
          rejectUnauthorized: true,
          keepAlive: true
        })
      }
    });
  }
}

let stage: string;
export function stageTableName(tableName: string): string {
  stage = stage || process.env.STAGE;
  if (!stage) {
    log.warn('STAGE environment variable not set, using STAGE=test');
    stage = 'test';
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
