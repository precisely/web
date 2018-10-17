import { Context } from 'aws-lambda';

import * as Logger from 'src/common/logger';
import { EmailArgs, EmailService } from './service';

export async function sendEmail(event: EmailArgs, context: Context) {
  const log = Logger.makeLogger(context.awsRequestId);
  log.info(`sendEmail called, to=${event.to}, subject=${event.subject}`);
  return await EmailService.send(event, log);
}
