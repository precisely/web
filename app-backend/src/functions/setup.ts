import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import dynogels from 'src/db/dynamo/dynogels';
import {log} from 'src/logger';

// ensure all dynogels models are loaded
export async function setupDynamo() {
  require('src/modules/models');
  await dynogels.createTablesAsync();
}

export const createTablesHandler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await setupDynamo();
    const message = 'Dynamo tables created or updated successfully';
    log.log(message);
    callback(null, message);
  } catch (error) {
    log.error(error);
    callback(error);
  }
};
