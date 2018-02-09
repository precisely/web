/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';

export interface IVendorDatatypeAttributes {
    vendor: string;
    data_type: string;
}

export interface IVendorDatatypeInstance 
        extends Sequelize.Instance<IVendorDatatypeAttributes>, IVendorDatatypeAttributes {
            
    id: number;
}

export const VendorDatatype = (sequelize: Sequelize.Sequelize): 
        Sequelize.Model<IVendorDatatypeInstance, IVendorDatatypeAttributes> => {

    const VendorDatatypeAttributes: Sequelize.Model<IVendorDatatypeInstance, IVendorDatatypeAttributes> =
            sequelize.define<IVendorDatatypeInstance, IVendorDatatypeAttributes>('vendorDatatype', {

        vendor: {
            type: Sequelize.STRING,
            allowNull: false
        },

        data_type: {
            type: Sequelize.STRING,
            allowNull: false,
        }

    }, {
        tableName: 'vendorDatatype',
        paranoid: true,
    });

    // Add your associations here
    VendorDatatypeAttributes[`associate`] = (
            models: {[index: string]: Sequelize.Model<Sequelize.Instance<any>, any>}
        ): void => {
        VendorDatatypeAttributes.hasOne(models[`UserDataMap`], {foreignKey: 'vendor_data_type_id'});
    };

    return VendorDatatypeAttributes;
};
