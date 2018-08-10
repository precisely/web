import * as https from 'https';

import {Model, ModelConfiguration, Item} from '@aneilbaboo/dynogels-promisified';
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
    // log at silly level if ENV=test-offline
    log[process.env.ENV === 'test-offline' ? 'silly' : 'info'](`Using offline dynamodb at ${dynamoEndpoint}`);
  }
} else {
  if (!inServerlessProcess) {
    log.silly(`Using AWS cloud hosted DynamoDB`);
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

let stage: string | undefined;
export function stageTableName(tableName: string): string {
  stage = stage || process.env.STAGE;
  if (!stage) {
    log.silly('STAGE environment variable not set, using STAGE=test');
    stage = 'test';
  }
  return `${stage}-${tableName}`;
}

export function tableNameWithoutStage(tableNameWithEnv: string): string {
  const result = /[^-]*-(.*)/.exec(tableNameWithEnv);
  return result ? result[1] : tableNameWithEnv;
}

interface ExtraMethods<Attributes> {
  getValid<K extends keyof Attributes>(k: K): Exclude<Attributes[K], null|undefined>;
}
const extraMethods = {
  getValid(k: string) {
    const _this = <any> this; // tslint:disable-line no-any
    const result = _this.get(k);
    if (!result) {
      throw new Error(`Attribute ${k} missing`);
    }
    return <any> result; // tslint:disable-line no-any
  }
};

export type ModelInstance<A, M> = Item<A, M & ExtraMethods<A>>;

export function defineModel<Attributes, InstanceMethods = {}, StaticMethods = {}>(
  tableName: string,
  config: ModelConfiguration,
  staticMethods?: new() => StaticMethods
):
  Model<Attributes, InstanceMethods & ExtraMethods<Attributes>> & StaticMethods {
  const fullName = stageTableName(tableName);
  const baseModel = dynogels.define<Attributes, InstanceMethods & ExtraMethods<Attributes>>(fullName, config);
  extend(baseModel.prototype, extraMethods);
  return extend(baseModel, 
    staticMethods ? (<any> staticMethods).prototype : <StaticMethods> {}); // tslint:disable-line no-any
}

export default dynogels;
