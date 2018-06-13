
import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import { makeLogger } from 'src/logger';

export const apiHandler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const log = makeLogger(event.requestContext);
  log.silly('Dummy handler for deploying CloudFormation faster!!');
};
