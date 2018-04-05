import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import dynogels from './dynogels';
import {log} from 'src/logger';

// @ts-ignore:no-unused-local -ignored as importing schema is necessary before creating but is not used explicitly
const {Report} = require('src/api/report/dynamo-models');
// @ts-ignore:no-unused-local
const {Genotype} = require('src/api/genotype/dynamo-models');

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
