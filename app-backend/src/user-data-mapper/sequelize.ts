/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';
import {UserDataMap} from 'src/user-data-mapper/user-data-map/models/UserDataMap';
import {VendorDatatype} from 'src/user-data-mapper/vendor-data-type/models/VendorDatatype';

console.log('Sequelize', Sequelize);
const sequelize: Sequelize.Sequelize = new Sequelize(
    process.env[`POSTGRES_DB_NAME`] || '',
    process.env[`POSTGRES_DB_USERNAME`] || '',
    process.env[`POSTGRES_DB_PASSWORD`] || '',
    {
        dialect: 'postgres',
        port: 5432,
        host: process.env[`POSTGRES_DB_CONN_STR`] || '',
        logging: false
    }
);

sequelize[`UserDataMap`] = UserDataMap(sequelize);
sequelize[`VendorDatatype`] = VendorDatatype(sequelize);

sequelize[`UserDataMap`].associate(sequelize);
sequelize[`VendorDatatype`].associate(sequelize);

sequelize[`UserDataMap`].sync();
sequelize[`VendorDatatype`].sync();

export {sequelize};
