import { IResolverObject } from 'graphql-tools';
import {Item} from 'src/db/dynamo/dynogels';

export {default as dynogels, tableNameWithoutStage} from './dynogels';

export function dynamoFieldResolver<T>(fields: (keyof T)[]): IResolverObject {
  let resolver = {};
  for (const field of fields) {
    resolver[<string> field] = (obj: Item<T>) => obj.get(field);
  }
  return resolver;
}
