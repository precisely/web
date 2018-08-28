import { models, listTableNames, tableNameWithoutStage } from 'src/db/dynamo/dynogels';
import { batchDelete } from 'src/db/dynamo/batch';

export async function clearCommand(tables?: string) {
  const tableNames = tables ? tables.toLowerCase().split(',').map(t => `${process.env.STAGE}-${t}`) : listTableNames();

  for (const tableName of tableNames) {
    const model = models[tableName];
    if (!model) {
      console.log('Invalid table %s', tableName);
      process.exit(1);
      return;
    }
    const {Items: items, Count: count} = await model.scan().where('seed').equals(true).execAsync();
    const attrList =  items.map(i => i.get());
    console.log('Deleting seed data in %s (%d items)', tableName, count);
    await batchDelete(model, attrList);
  }
}
