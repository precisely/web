/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';

export interface IUserDataMapAttributes {
    user_id: string;
    vendor_data_type: string;
    data_type_user_id: string;
}

export interface IUserDataMapInstance extends Sequelize.Instance<IUserDataMapAttributes>, IUserDataMapAttributes {

}

export const vendorDataTypeList: string[] = [
    // Add vendorDataType here
    'precisely:demo',
    'precisely:test',
    'precisely:genetics',
];

export const UserDataMap = (sequelize: Sequelize.Sequelize): 
        Sequelize.Model<IUserDataMapInstance, IUserDataMapAttributes> => {

    const UserDataMapAttributes: Sequelize.Model<IUserDataMapInstance, IUserDataMapAttributes> =
            sequelize.define<IUserDataMapInstance, IUserDataMapAttributes>('userDataMap', {

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
        tableName: 'userDataMap'
    });

    return UserDataMapAttributes;
};
