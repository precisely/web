import * as dynogels from '@aneilbaboo/dynogels-promisified';
import { Model } from './dynogels';

export async function resetAllTables() {
  if (process.env.STAGE === 'prod') {
    throw new Error('Refusing to clear tables on prod');
  }
  await Promise.all((<any> Object).values(dynogels.models).map(async (model: Model) => { // tslint:disable-line no-any
    try { 
      await model.deleteTableAsync(); 
    } 
    finally {
      await model.createTableAsync();
    }
  }));
}
