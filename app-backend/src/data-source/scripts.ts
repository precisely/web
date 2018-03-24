import * as shell from 'shelljs';
import {Secrets} from '../interfaces';
import {log} from '../logger';

export const deploy = (environment: string) => {
  shell.cd('../../'); // Changing the working directory to the app root;
  shell.exec(`./node_modules/.bin/serverless decrypt -s ${environment}`, (code, stdout) => {
    const position: number = stdout.indexOf('SECRETS');

    if (position > -1) {
      // Parsing the secrets to JSON.
      const secrets: Secrets = JSON.parse(stdout.substring(position + 10));
      process.env.POSTGRES_DB_NAME = secrets.POSTGRES_DB_NAME;
      process.env.POSTGRES_DB_USERNAME = secrets.POSTGRES_DB_USERNAME;
      process.env.POSTGRES_DB_PASSWORD = secrets.POSTGRES_DB_PASSWORD;
      process.env.POSTGRES_DB_CONN_STR = secrets.POSTGRES_DB_CONN_STR;

      /**
       * This a workaround to set the environment variables in the AWS Lambda during deployment.
       */
      // tslint:disable-next-line
      shell.exec(`./node_modules/.bin/env-cmd ../config/security.env.dev ./node_modules/.bin/serverless deploy -s ${environment}`, (deployCode, deployStdout) => {
        log.info(deployStdout);
      });
    }
  });
};
