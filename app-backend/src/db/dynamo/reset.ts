import * as dynogels from '@aneilbaboo/dynogels-promisified';

export async function resetAllTables() {
  if (process.env.STAGE === 'prod') {
    throw new Error('Refusing to clear tables on prod');
  }
  await Promise.all(Object.values(dynogels.models).map(async model => {
    try { 
      await model.deleteTableAsync(); 
    } 
    finally {
      await model.createTableAsync();
    }
  }));
}
