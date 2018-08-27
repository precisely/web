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

import { geneticsCommand} from './commands/genetics';
import { variantCommand } from './commands/variant';
import { reportsCommand } from './commands/reports';
import { clearCommand } from 'src/db/seed/commands/clear';

async function processCommand() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  switch (command) {
    case 'genetics': 
      await geneticsCommand(...args);
      break;
    case 'variant': 
      await variantCommand(...args);
      break;
    case 'reports': 
      await reportsCommand(...args);
      break;
    case 'clear':
      await clearCommand(...args);
      break;
    default:
      console.log(
        'usage:\n' +
        '\tyarn sls seed:genetics {userId} {wt|het|hom|lessCommonHet|compoundHet}\n' +
        '\tyarn sls seed:variant {userId} {variant - e.g., mthfr.c677t:het}' +
        '\tyarn sls seed:reports'
      );
  }
}

processCommand();
