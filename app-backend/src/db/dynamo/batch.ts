import { Model, CreateItemOptions, UpdateItemOptions } from '@aneilbaboo/dynogels-promisified';
import batchPromises = require('batch-promises');

import { dynamoDBDefaultBatchSize } from 'src/common/environment';

export type BatchItem<T> = { data: T, error?: string };

export async function batchCreate<Attrs>( // tslint:disable-line no-any
  model: Model, createArgList: Attrs[], options: CreateItemOptions = {}
): Promise<BatchItem<Attrs>[]> {
  return await batchPromises<Attrs, BatchItem<Attrs>>( // tslint:disable-line no-any
    dynamoDBDefaultBatchSize, createArgList, 
    async (createArgs: Attrs) => {
      try {
        const result = await model.createAsync(createArgs, options);
        return { data: <Attrs> result.get() };
      } catch (e) {
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
        const result = await model.updateAsync(updateAttrs, options);
        return { data: <Attrs> result.get() };
      } catch (e) {
        return { data: updateAttrs, error: e.toString() || ''};
      }
    }
  );
}
