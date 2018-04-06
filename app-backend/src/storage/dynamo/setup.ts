import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import dynogels from './dynogels';
import {log} from 'src/logger';

// ensure all dynogels models are loaded
require('src/api/models');

export const setupDatabase: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  dynogels.createTables((error: Error) => {
    if (error) {
      log.error(`Error while creating the tables. ${error.message}`);
      return callback(new Error('Error while creating the tables.'), null);
    }

    return callback(null, 'Tables Created Successfully');
  });
};
