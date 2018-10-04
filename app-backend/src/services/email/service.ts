import * as AWS from 'aws-sdk';
import * as SendGrid from '@sendgrid/mail';
import { MailData } from "@sendgrid/helpers/classes/mail";

import * as Logger from 'src/common/logger';


export interface EmailConf {
  to: string;
  subject: string;
  text: string;
}


const ssmParamSendGridToken = 'API_TOKEN_SENDGRID';


export class EmailService {

  static async send(conf: EmailConf, log: Logger.Logger = Logger.log): Promise<boolean> {
    log.info(`attempting to send email to ${conf.to}`);
    const ssm = new AWS.SSM();
    const sgKeyRaw = await ssm.getParameter({Name: ssmParamSendGridToken}).promise();
    const sgKey = sgKeyRaw && sgKeyRaw['Parameter'] && sgKeyRaw['Parameter']['Value'];
    if (sgKey) {
      SendGrid.setApiKey(sgKey);
    } else {
      log.error('failed to retrieve SendGrid API key');
      return false;
    }
    const mailData: MailData = {
      from: 'system@precise.ly',
      to: conf.to,
      subject: conf.subject,
      text: conf.text
    };
    await SendGrid.send(mailData);
    return true;
  }

}
