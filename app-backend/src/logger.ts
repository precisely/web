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

export const LOG_DATA_SEP = '\t|\t';

type FormatInfo = { timestamp: number, level: number | string, message: string };

const shouldLogToCloudWatchAggregate = !(process.env.STAGE === 'prod' || process.env.STAGE === 'offline');
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();
const LOG_TRANSPORTS = shouldLogToCloudWatchAggregate ? [
  new winston.transports.Console()
] : [
  new winston.transports.Console(),

  // Adds Cloudwatch logging at
  // /precisely/web/{stage}/aggregated-log
  new WinstonCloudWatch({ // aggregate view across all lambda fns
    LOG_LEVEL,
    logGroupName: `/precisely/web/${process.env.STAGE}`,
    logStreamName: 'aggregated-log'
  })
];

const BaseFormat = [
  format.timestamp(),
  format.splat(),
  format.printf(
    (info: FormatInfo) => `${info.timestamp} ${info.level}: ${info.message}${LOG_DATA_SEP}`)
];

const ColorizedFormat = [ format.colorize(), ...BaseFormat ];

winston.levelValue = function levelValue(level: number | string) {
  if (typeof level === 'string') {
    return this.levels[level.toLowerCase()];
  } else {
    return level;
  }
};

winston.shouldLog = function shouldLog(level: number | string) {
  return this.levelValue(this.level) >= this.levelValue(level);
};

// no colorization when logging to AWS
const LOG_FORMAT = format.combine.apply(format, process.env.STAGE === 'offline' ? ColorizedFormat : BaseFormat);

export const log = winston.createLogger({
  transports: LOG_TRANSPORTS,
  level: LOG_LEVEL,
  format: LOG_FORMAT
});
