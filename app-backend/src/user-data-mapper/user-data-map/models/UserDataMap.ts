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
    vendor_data_type_id: number;
    data_type_user_id: string;
}

export interface IUserDataMapInstance extends Sequelize.Instance<IUserDataMapAttributes>, IUserDataMapAttributes {

}

export const UserDataMap = (sequelize: Sequelize.Sequelize): 
        Sequelize.Model<IUserDataMapInstance, IUserDataMapAttributes> => {

    const UserDataMapAttributes: Sequelize.Model<IUserDataMapInstance, IUserDataMapAttributes> =
            sequelize.define<IUserDataMapInstance, IUserDataMapAttributes>('userDataMap', {

        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'userIdAndVendorDataTypeId'
        },

        data_type_user_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        vendor_data_type_id: {
            type: Sequelize.INTEGER,
            unique: 'userIdAndVendorDataTypeId'
        }
    }, {
        tableName: 'userDataMap'
    });

    // Add your associations here
    UserDataMapAttributes[`associate`] = (
            models: {[index: string]: Sequelize.Model<Sequelize.Instance<any>, any>} // tslint:disable-line:no-any
        ): void => {
        UserDataMapAttributes.belongsTo(
                models[`VendorDatatype`],
                {
                    as: 'vendor_data_type',
                    foreignKey: 'vendor_data_type_id',
                }
        );
    };

    return UserDataMapAttributes;
};
