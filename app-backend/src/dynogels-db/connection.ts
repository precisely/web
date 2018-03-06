const dynogels = require('dynogels-promisified');

dynogels.AWS.config.update({region: process.env.REGION});

export {dynogels};
