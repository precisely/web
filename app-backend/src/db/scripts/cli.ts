// Set AWS region explicitly:
//
// The AWS SDK automatically picks up the AWS_REGION from the AWS 
// environment. Since this script will be run on a developer's trying
// to update an AWS environment from their local machine, we need to
// provide the region, and do it this way to ensure that it is set
// before any other dynogels code is run:
const dynogels = require('@aneilbaboo/dynogels-promisified');
dynogels.AWS.config.update({
  region: process.env.REGION
});

import { geneticsCommand} from './commands/seed/genetics';
import { variantCommand } from './commands/seed/variant';
import { reportsCommand } from './commands/seed/reports';
import { clearCommand } from './commands/seed/clear';
import { dynamodbResetCommand } from './commands/dynamodb';
import { upscaleDynamoDB, downscaleDynamoDB } from './throughput';

async function processCommand() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  const commandToAction = {
    'seed:genetics': geneticsCommand,
    'seed:variant': variantCommand,
    'seed:reports': reportsCommand,
    'seed:clear': clearCommand,
    'dynamodb:reset': dynamodbResetCommand
  };
  const action = commandToAction[command];
  if (action) {
    try {
      await upscaleDynamoDB();
      await action(...args);
    } catch (e) {
      console.log(e);
    } finally {
      await downscaleDynamoDB();
    }
  } else {
    console.log(
      'usage:\n' +
      '\tyarn sls seed:genetics --user {userId} --genetics {wt|het|hom|lessCommonHet|compoundHet}\n' +
      '\tyarn sls seed:variant --user {userId} --variant {variant - e.g., mthfr.c677t:het}\n' +
      '\tyarn sls seed:reports\n' +
      '\tyarn sls seed:clear --models "{model1,model2,...}"' +
      '\tyarn sls dynamodb:reset\n'         
    );
  }
}

processCommand();
