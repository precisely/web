import { models, listTableNames, resetAllTables, batchDelete } from 'src/db/dynamo';

export async function dynamodbResetCommand(...args: any[]): Promise<any> { // tslint:disable-line no-any
  await resetAllTables();
  console.log('Reset %d tables', Object.keys(models).length);
}
