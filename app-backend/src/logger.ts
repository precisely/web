/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/* istanbul ignore next */
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');

/* istanbul ignore next */
export const log = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      logGroupName: '/precisely/web',
      logStreamName: 'aggregated-log'
    })
  ]
});
