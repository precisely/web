import * as AWS from 'aws-sdk';
import * as Request from 'request';
import * as RequestPromise from 'request-promise-native';
import * as SendGrid from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';

import * as Logger from 'src/common/logger';
import { getEnvVar } from 'src/common/environment';

export interface EmailArgs {
  to: string;
  subject: string;
  text: string;
}

const ssmParamSendGridToken = 'API_SENDGRID_TOKEN';
const ssmParamAuth0ClientId = 'API_AUTH0_CLIENT_ID';
const ssmParamAuth0ClientSecret = 'API_AUTH0_CLIENT_SECRET';

const reEmail = new RegExp(/(.+)@(.+)\.(.+)/);

const auth0Domain = `${getEnvVar('AUTH0_TENANT_NAME')}.auth0.com`;

interface ResultAuth0BearerToken {
  access_token: string;
}

interface ResultAuth0Email {
  email: string;
}

async function getSSMParameter(parameter: string) {
  const ssm = new AWS.SSM();
  const keyRaw: AWS.SSM.Types.GetParameterResult = await ssm.getParameter({Name: parameter}).promise();
  const key = keyRaw && keyRaw.Parameter && keyRaw.Parameter.Value;
  return key;
}

async function getAuth0BearerToken() {
  const auth0Id = await getSSMParameter(ssmParamAuth0ClientId);
  const auth0Secret = await getSSMParameter(ssmParamAuth0ClientSecret);
  const reqParams: Request.UrlOptions & Request.CoreOptions = {
    method: 'POST',
    url: `https://${auth0Domain}/oauth/token`,
    body: {
      client_id: auth0Id,
      client_secret: auth0Secret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: 'client_credentials'
    },
    json: true
  };
  const resp: ResultAuth0BearerToken = await RequestPromise(reqParams);
  if (resp && resp.access_token) {
    return resp.access_token;
  } else {
    throw 'no Auth0 access token retrieved';
  }
}

async function getAuth0User(auth0AccessToken: string, userId: string) {
  // XXX: Yup, this builds a raw HTTP request. Couldn't force the official
  // auth0-js client library to work in making a getUser request.
  const reqParams: Request.UrlOptions & Request.CoreOptions = {
    method: 'GET',
    url: `https://${auth0Domain}/api/v2/users/${userId}`,
    qs: {
      fields: 'email'
    },
    auth: {
      bearer: auth0AccessToken
    },
    json: true
  };
  const resp: ResultAuth0Email = await RequestPromise(reqParams);
  if (resp && resp.email) {
    return resp.email;
  } else {
    throw 'Auth0 email retrieval failed';
  }
}

export class EmailService {

  static async send(conf: EmailArgs, log: Logger.Logger = Logger.log): Promise<boolean> {
    log.info(`attempting to send email to ${conf.to}`);
    const sgKey = await getSSMParameter(ssmParamSendGridToken);
    if (sgKey) {
      SendGrid.setApiKey(sgKey);
    } else {
      log.error('failed to retrieve SendGrid API key');
      return false;
    }
    let realTo = conf.to;
    if (!realTo.match(reEmail)) {
      // deal with mapping Auth0 ID to email address
      let auth0BearerToken;
      try {
        auth0BearerToken = await getAuth0BearerToken();
      } catch (err) {
        log.error(`failed to retrieve Auth0 access token, error: ${err}`);
        return false;
      }
      const auth0UserId = conf.to.replace('-', '|');
      try {
        realTo = await getAuth0User(auth0BearerToken, auth0UserId);
      } catch (err) {
        log.error(`failed to resolve email address for ${auth0UserId}, error: ${err}`);
        return false;
      }
    }
    log.info(`actually sending email to ${realTo}`);
    const mailData: MailData = {
      from: getEnvVar('FROM_EMAIL'),
      to: realTo,
      subject: conf.subject,
      text: conf.text
    };
    try {
      await SendGrid.send(mailData);
    } catch (err) {
      log.error(`email send failed, error: ${err}`);
      return false;
    }
    return true;
  }

}
