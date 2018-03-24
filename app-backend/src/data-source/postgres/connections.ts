/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';

export const connection: Sequelize.Sequelize = new Sequelize(
  process.env[`POSTGRES_DB_NAME`] || '',
  process.env[`POSTGRES_DB_USERNAME`] || '',
  process.env[`POSTGRES_DB_PASSWORD`] || '',
  {
    dialect: 'postgres',
    port: 5432,
    host: process.env[`POSTGRES_DB_CONN_STR`] || '',
    logging: false,
    pool: {
      max: 1,
      min: 0,
      idle: 10000
    },
  }
);
