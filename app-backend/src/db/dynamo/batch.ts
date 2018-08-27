/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:51:23 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-27 14:31:47
 */

import { Model, CreateItemOptions, UpdateItemOptions, DestroyItemOptions } from '@aneilbaboo/dynogels-promisified';
import batchPromises = require('batch-promises');

import { dynamoDBDefaultBatchSize } from 'src/common/environment';
import { log } from 'src/common/logger';

export type BatchItem<T> = { data: T & { [key: string]: any }, error?: string }; // tslint:disable-line no-any

export async function batchCreate<Attrs>( // tslint:disable-line no-any
  model: Model, createArgList: Attrs[], options: CreateItemOptions = {}
): Promise<BatchItem<Attrs>[]> {
  return await batchPromises<Attrs, BatchItem<Attrs>>( // tslint:disable-line no-any
    dynamoDBDefaultBatchSize, createArgList, 
    async (createArgs: Attrs) => {
      try {
        log.silly('batchCreate creating %j', <any> createArgs); // tslint:disable-line no-any
        const result = await model.createAsync(createArgs, options);
        return { data: <Attrs> result.get() };
      } catch (e) {
        log.silly('batchCreate failed %j error: %j', <any> createArgs, <any> e); // tslint:disable-line no-any
        return { data: createArgs, error: e.toString() || ''};
      }
    }
  );
}

export async function batchUpdate<Attrs>( // tslint:disable-line no-any
  model: Model, updateArgList: Attrs[], options: UpdateItemOptions = {}
): Promise<BatchItem<Attrs>[]> {
  return await batchPromises<Attrs, BatchItem<Attrs>>( // tslint:disable-line no-any
    dynamoDBDefaultBatchSize, updateArgList, 
    async (updateAttrs: Attrs) => {
      try {
        log.silly('batchUpdate updating %j', <any> updateAttrs); // tslint:disable-line no-any
        const result = await model.updateAsync(updateAttrs, options);
        return { data: <Attrs> result.get() };
      } catch (e) {
        log.silly('batchUpdate failed %j error: %j', <any> updateAttrs, <any> e); // tslint:disable-line no-any
        return { data: updateAttrs, error: e.toString() || ''};
      }
    }
  );
}

export async function batchDelete<Attrs>( // tslint:disable-line no-any
  model: Model, deleteArgList: Attrs[], options: DestroyItemOptions = {}
): Promise<BatchItem<Attrs>[]> {
  return await batchPromises<Attrs, BatchItem<Attrs>>( // tslint:disable-line no-any
    dynamoDBDefaultBatchSize, deleteArgList, 
    async (deleteAttrs: Attrs) => {
      try {
        log.silly('batchDelete deleting %j', <any> deleteAttrs); // tslint:disable-line no-any
        const hashKey = deleteAttrs[model.schema.hashKey];
        const rangeKey = deleteAttrs[model.schema.rangeKey];

        const result = await model.destroyAsync(hashKey, rangeKey);
        return { data: <Attrs> result.get() };
      } catch (e) {
        log.silly('batchDelete failed %j error: %j', <any> deleteAttrs, <any> e); // tslint:disable-line no-any
        return { data: deleteAttrs, error: e.toString() || ''};
      }
    }
  );
}

