import * as shell from 'shelljs';
import {log} from '../logger';

export const deploy = (environment: string) => {
  shell.cd('../../'); // Changing the working directory to the app root;
  shell.exec(`serverless decrypt -s ${environment}`, (code, stdout) => {

    let secrets = extractSecret(stdout);

    if (!secrets) {
      return;
    }

    process.env.POSTGRES_DB_NAME = secrets.POSTGRES_DB_NAME;
    process.env.POSTGRES_DB_USERNAME = secrets.POSTGRES_DB_USERNAME;
    process.env.POSTGRES_DB_PASSWORD = secrets.POSTGRES_DB_PASSWORD;
    process.env.POSTGRES_DB_CONN_STR = secrets.POSTGRES_DB_CONN_STR;

    // This a workaround to set the environment variables in the AWS Lambda during deployment.
    shell.exec(`env-cmd ../config/security.env.dev serverless deploy -s ${environment}`, (deployCode, deployStdout) => {
      log.info(deployStdout);
    });
  });
};

function extractSecret(decryptText: string) {
  const secretStartPosition: number = decryptText.indexOf('SECRETS');

  if (secretStartPosition === -1) {
    return;
  }

  // Parsing the secrets to JSON.
  return JSON.parse(decryptText.substring(secretStartPosition + 'SECRETS ='.length));
}
