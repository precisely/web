import { Handler, Context, Callback } from 'aws-lambda';

import * as Logger from 'src/common/logger';
import { EmailConf, EmailService } from './service';

export async function sendEmail(event: EmailConf, context: Context) {
  const log = Logger.makeLogger(context.awsRequestId);
  log.info('sendEmail called');
  return await EmailService.send(event, log);
}
