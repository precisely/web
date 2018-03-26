import {Context, Callback, APIGatewayEvent} from 'aws-lambda';
import {dynogels} from './connection';
import {log} from '../../logger';

// @ts-ignore:no-unused-local -ignored as importing schema is necessary before creating but is not used explicitly
const {Report} = require('../../features/report/models/Report');
// @ts-ignore:no-unused-local
const {Genotype} = require('../../features/genotype/models/Genotype');

export function setupDatabase(event: APIGatewayEvent, context: Context, callback: Callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  dynogels.createTables((error: Error): void => {
    if (error) {
      log.error(`Error while creating the tables: ${error.message}`);
      return callback(new Error('Error while creating the tables.'), null);
    }
    return callback(null, 'Tables Created Successfully');
  });
}
