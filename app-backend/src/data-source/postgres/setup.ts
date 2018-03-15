import * as Sequelize from 'sequelize';

export const sequelize: Sequelize.Sequelize = new Sequelize(
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
