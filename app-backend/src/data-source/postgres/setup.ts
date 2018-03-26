import * as shell from 'shelljs';
import {log} from '../../logger';
import {Secrets} from '../../interfaces';

export function migrate(environment: string) {
  shell.cd('../../'); // Changing the working directory to the app root;

  if (environment === 'local') {
    // tslint:disable-next-line
    shell.exec(`./node_modules/.bin/sequelize db:migrate --url 'postgres://${process.env.POSTGRES_DB_USERNAME}:${process.env.POSTGRES_DB_PASSWORD}@${process.env.POSTGRES_DB_CONN_STR}/${process.env.POSTGRES_DB_NAME}'`, function(decryptCode, decryptStdout) {
      log.info(decryptStdout);
    });
  }

  if (environment === 'dev' || environment === 'stage' || environment === 'prod') {
    shell.exec(`./node_modules/.bin/serverless decrypt -s ${environment}`, function(code: number, stdout: string) {
      const position: number = stdout.indexOf('SECRETS');

      if (position > -1) {
        // Parsing the secrets to JSON.
        const secrets: Secrets = JSON.parse(stdout.substring(position + 10));

        // tslint:disable-next-line
        shell.exec(`./node_modules/.bin/sequelize db:migrate --url 'postgres://${secrets.POSTGRES_DB_USERNAME}:${secrets.POSTGRES_DB_PASSWORD}@${secrets.POSTGRES_DB_CONN_STR}/${secrets.POSTGRES_DB_NAME}'`, function (decryptCode, decryptStdout){
          log.info(decryptStdout);
        });
      }
    });
  }
}
