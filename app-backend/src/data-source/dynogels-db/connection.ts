import * as AWS from 'aws-sdk';
const dynogels = require('dynogels-promisified');

dynogels.AWS.config.update({
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new AWS.SharedIniFileCredentials({ profile: process.env.NODE_ENV + '-profile-precisely' }),
  endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
});

export {dynogels};
