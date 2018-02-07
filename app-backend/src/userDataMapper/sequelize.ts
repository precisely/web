import * as Sequelize from 'sequelize';
import {UserDataMap} from './userDataMap/UserDataMap';
import {VendorDatatype} from './vendorDatatype/VendorDatatype';

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
