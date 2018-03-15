const dynogels = require('dynogels-promisified');

dynogels.AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
});

export {dynogels};
