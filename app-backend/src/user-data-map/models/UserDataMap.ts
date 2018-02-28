/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';

const sequelize: Sequelize.Sequelize = new Sequelize(
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
        }
    }
);

export interface UserDataMapAttributes {
    user_id: string;
    vendor_data_type: string;
    data_type_user_id: string;
}

export interface UserDataMapInstance extends Sequelize.Instance<UserDataMapAttributes>, UserDataMapAttributes {

}

export const vendorDataTypeList: string[] = [
    // Add vendorDataType here
    'precisely:demo',
    'precisely:test',
    'precisely:genetics',
];

export const UserDataMap: Sequelize.Model<UserDataMapInstance, UserDataMapAttributes> = 

        sequelize.define<UserDataMapInstance, UserDataMapAttributes>('userDataMap', {

            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: 'userIdAndVendorDataType'
            },

            data_type_user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },

            vendor_data_type: {
                type: Sequelize.STRING,
                unique: 'userIdAndVendorDataType',
                validate: {
                    isIn: {
                        args: [vendorDataTypeList],
                        msg: 'No such vendorDataType exists'
                    }
                }
            }
        }, {
            tableName: 'user_data_map'
        }
    );
