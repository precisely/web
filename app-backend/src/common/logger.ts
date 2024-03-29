/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {isArray} from 'util';
import {isOffline} from 'src/common/environment';

const winston = require('winston');
const { format } = winston;
const WinstonCloudWatch = require('winston-cloudwatch');

export const LOG_DATA_SEP = '\t|\t';
import * as fs from 'fs';

type FormatInfo = { timestamp: number, level: number | string, message: string };
const shouldLogToCloudWatchAggregate = process.env.STAGE !== 'prod' && !isOffline;
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();

function makeFormatter(colorize: boolean, requestId?: string) {
  const plugins = [ format.timestamp(), format.splat() ];
  if (colorize) {
    plugins.push(format.colorize());
  }
  if (requestId) {
    plugins.push(format.printf(
      (info: FormatInfo) => `${info.timestamp} ${info.level}: ${info.message} [${requestId}]${LOG_DATA_SEP}`)
    );
  } else {
    plugins.push(format.printf(
      (info: FormatInfo) => `${info.timestamp} ${info.level}: ${info.message}${LOG_DATA_SEP}`)
    );
  }
  return format.combine(... plugins);
}

type LogMethodBaseArguments = string | number | object;
type LogMethodArguments = LogMethodBaseArguments | LogMethodBaseArguments[];

export interface Logger {
  levels: { [key: string]: number };

  error(message: string, ...args: LogMethodArguments[]): void;
  warn(message: string, ...args: LogMethodArguments[]): void;
  info(message: string, ...args: LogMethodArguments[]): void;
  debug(message: string, ...args: LogMethodArguments[]): void;
  silly(message: string, ...args: LogMethodArguments[]): void;
  http(message: string, ...args: LogMethodArguments[]): void;
  verbose(message: string, ...args: LogMethodArguments[]): void;

  switch(levels: { [key: string]: (string|number|object)[] }): void;
  levelValue(level: number | string): number;
  shouldLog(level: number | string): boolean;
}

function makeTransports() {
  return shouldLogToCloudWatchAggregate ? [
    new winston.transports.Console(),
  
    // Adds Cloudwatch logging at
    // /precisely/web/{stage}/aggregated-log
    new WinstonCloudWatch({ // aggregate view across all lambda fns
      level: LOG_LEVEL,
      logGroupName: `/precisely/web/${process.env.STAGE}`,
      logStreamName: 'aggregated-log'
    })
  ] : [
    new winston.transports.Console()
  ];
}

export function makeLogger(requestId?: string): Logger {
  const shouldColorize = isOffline;
  const logger = winston.createLogger({
    transports: makeTransports(),
    level: LOG_LEVEL,
    format: makeFormatter(shouldColorize, requestId)
  });

  logger.levelValue = function levelValue(level: number | string) {
    if (typeof level === 'string') {
      return this.levels[level.toLowerCase()];
    } else {
      return level;
    }
  };

  logger.shouldLog = function shouldLog(level: number | string) {
    return this.levelValue(this.level) >= this.levelValue(level);
  };

  logger.switch = function (levels: { [key: string]: (string|number|object)[] }) {
    for (let logLevel of Object.keys(this.levels)) {
      if (levels.hasOwnProperty(logLevel) && this.shouldLog(logLevel)) {
        let args = levels[logLevel];
        args = isArray(args) ? args : [args];
        this[logLevel].apply(this, args);
        break;
      }
    }
  };

  return logger;
}

export const log = makeLogger(); // default logger
