import { DynamoDB } from 'aws-sdk';
const dynogels = require('@aneilbaboo/dynogels-promisified');

export async function upscaleDynamoDB() {
  await setThroughput(100, 100);
}

export async function downscaleDynamoDB() {
  await setThroughput(5, 5);
}

export async function setThroughput(readUnits: number, writeUnits: number) {
  const promises = [];
  for (const tableName in dynogels.models) {
    if (dynogels.models.hasOwnProperty(tableName)) {
      promises.push(setDynamoTableThroughput(tableName, {
        ReadCapacityUnits: readUnits,
        WriteCapacityUnits: writeUnits
      }));
    }
  }
  await Promise.all(promises);
}

export async function getDynamoTableThroughput(tableName: string): Promise<DynamoDB.ProvisionedThroughput> {
  const dynamo = <DynamoDB> new dynogels.AWS.DynamoDB();
  const result = await dynamo.describeTable({TableName: tableName}).promise();
  const throughput = result.Table && result.Table.ProvisionedThroughput;
  if (!throughput) {
    throw new Error(`Cannot determine throughput of ${tableName}`);
  }
  return <DynamoDB.ProvisionedThroughput> throughput;
}

export async function setDynamoTableThroughput(tableName: string, throughput: DynamoDB.ProvisionedThroughput) {
  const dynamo = <DynamoDB> new dynogels.AWS.DynamoDB();
  await dynamo.updateTable({
    TableName: tableName, 
    ProvisionedThroughput: throughput
  }).promise();
}
