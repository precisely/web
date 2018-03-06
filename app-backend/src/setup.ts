import {AWS} from 'dynogels';
import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';

const dynogels = require('dynogels-promisified');
// @ts-ignore:no-unused-local -ignored as importing schema is necessary before creating but is not used explicitly
const {Report} = require('./report-service/models/Report');
// @ts-ignore:no-unused-local
const {Genotype} = require('./genotype-service/models/Genotype');

export const setupDatabase: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    AWS.config.update({region: process.env.REGION});
    dynogels.createTables((error: Error): void => {
        if (error) {
            console.log('Error while creating the tables.', error.message);
            return callback(new Error('Error while creating the tables.'), null);
        }

        return callback(null, 'Tables Created Successfully');
    });
};
