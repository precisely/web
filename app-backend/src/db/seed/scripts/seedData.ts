/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {seedReport, seedGenotype} from './seedDynamo';
import {log} from 'src/common/logger';

export const setEnvironment = (secrets: string) => {
  const lines: string[] = secrets.slice(1, secrets.length - 1).split(',');

  lines.forEach((line: string): void => {
    const key: string = line.split(':')[0];
    const value: string = line.split(':')[1];
    process.env[key] = value;
  });
};

/* istanbul ignore next */
(async () => {
  log.info(`Seeding started for ${process.env.DB || process.env.NODE_ENV} environment.`);
  setEnvironment(process.argv.pop());

  // also need to seed the DataBridge
  seedReport();
  seedGenotype();

})();