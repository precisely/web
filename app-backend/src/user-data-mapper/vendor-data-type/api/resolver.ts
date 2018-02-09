/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';
import {sequelize} from 'src/user-data-mapper/sequelize';
import {
    IVendorDatatypeInstance,
    IVendorDatatypeAttributes,
} from 'src/user-data-mapper/vendor-data-type/models/VendorDatatype';

const VendorDatatype: Sequelize.Model<IVendorDatatypeInstance, IVendorDatatypeAttributes> 
        = sequelize[`VendorDatatype`];

export const VendorDatatypeResolver = {

    async create(args: {vendor: string, data_type: string}) {
        let vendorDatatypeInstance: IVendorDatatypeInstance;
        try {
            vendorDatatypeInstance = await VendorDatatype.create({
                vendor: args.vendor,
                data_type: args.data_type
            });
        } catch (error) {
            console.log('VendorDatatype-Create:', error.message);
            return error;
        }
        
        return vendorDatatypeInstance.get({plain: true});
    },

    async list() {
        const vendorDatatypeInstances: IVendorDatatypeInstance[] = await VendorDatatype.findAll({raw: true});
        return vendorDatatypeInstances;
    },
    
    async get(args: {id: number}) {
        let vendorDatatypeInstance: IVendorDatatypeInstance;
        try {
            vendorDatatypeInstance = await VendorDatatype.findById(args.id);
            if (!vendorDatatypeInstance) {
                throw new Error('No such vendor found');
            }
        } catch (error) {
            console.log('VendorDatatype-get:', error.message);
            return error;
        }

        return vendorDatatypeInstance;
    },

    async update(args: {id: number, data: IVendorDatatypeAttributes}) {
        let updated: IVendorDatatypeInstance;
        try {
            const vendorDatatype = await VendorDatatype.findById(args.id);
            if (!vendorDatatype) {
                throw new Error('No such vendor found');
            }
            updated = await vendorDatatype.update({...args.data}, {where: {id: args.id}});
        } catch (error) {
            console.log('VendorDatatype-update:', error.message);
            return error;
        }

        return updated;
    },

    async delete(args: {id: number}) {
        let deleted: number;
        try {
            deleted = await VendorDatatype.destroy({where: {id: args.id}});
            if (!deleted) {
                throw new Error('Couldn\'t be deleted');
            }
        } catch (error) {
            console.log('VendorDatatype-delete:', error.message);
            return error;
        }

        return {success: true, message: 'Deleted Successfully'};
    },
};
