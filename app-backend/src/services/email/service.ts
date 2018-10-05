import * as AWS from 'aws-sdk';
import * as SendGrid from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';

import * as Logger from 'src/common/logger';
import { getEnvVar } from 'src/common/environment';

export interface EmailArgs {
  to: string;
  subject: string;
  text: string;
}

const ssmParamSendGridToken = 'API_TOKEN_SENDGRID';

export class EmailService {

  static async send(conf: EmailArgs, log: Logger.Logger = Logger.log): Promise<boolean> {
    log.info(`attempting to send email to ${conf.to}`);
    const ssm = new AWS.SSM();
    const sgKeyRaw: AWS.SSM.Types.GetParameterResult = await ssm.getParameter({Name: ssmParamSendGridToken}).promise();
    const sgKey = sgKeyRaw && sgKeyRaw.Parameter && sgKeyRaw.Parameter.Value;
    if (sgKey) {
      SendGrid.setApiKey(sgKey);
    } else {
      log.error('failed to retrieve SendGrid API key');
      return false;
    }
    const mailData: MailData = {
      from: getEnvVar('FROM_EMAIL'),
      to: conf.to,
      subject: conf.subject,
      text: conf.text
    };
    try {
      await SendGrid.send(mailData);
    } catch (err) {
      log.error(`email send failed: ${err}`);
      return false;
    }
    return true;
  }

}
