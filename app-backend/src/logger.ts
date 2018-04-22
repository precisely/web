/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/* istanbul ignore next */
const winston = require('winston');
const { format } = winston;
const WinstonCloudWatch = require('@aneilbaboo/winston-cloudwatch');
const level = (process.env.LOG_LEVEL || 'info').toLowerCase();

export const LOG_DATA_SEP = '\t|\t';

type FormatInfo = { timestamp: number, level: number | string, message: string };

const shouldLogToCloudWatchAggregate = !(process.env.STAGE === 'prod' || process.env.STAGE === 'offline');

const transports = shouldLogToCloudWatchAggregate ? [
  new winston.transports.Console()
] : [
  new winston.transports.Console(),

  // Adds Cloudwatch logging at
  // /precisely/web/{stage}/aggregated-log
  new WinstonCloudWatch({ // aggregate view across all lambda fns
    level,
    logGroupName: `/precisely/web/${process.env.STAGE}`,
    logStreamName: 'aggregated-log'
  })
];

/* istanbul ignore next */
export const log = winston.createLogger({
  level,
  transports,

  // note: if you add or remove formats, make sure to update
  // webpack.config.js ContextReplacementPlugin for /logform/
  // I submitted a PR to address the underlying issue:
  // https://github.com/winstonjs/logform/pull/24
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.splat(),
    format.printf(
      (info: FormatInfo) => `${info.timestamp} ${info.level}: ${info.message}${LOG_DATA_SEP}`))
});
