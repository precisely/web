import * as Sequelize from 'sequelize';
import {sequelize} from '../sequelize';
import {IVendorDatatypeInstance, IVendorDatatypeAttributes} from 'src/userDataMapper/vendorDatatype/VendorDatatype';

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
            console.log('Error:', error.message);
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
            if (!vendorDatatypeInstance) throw new Error('No such user found');
        } catch (error) {
            console.log('Error:', error.message);
            return error;
        }

        return vendorDatatypeInstance;
    },

    async update(args: {id: number, data: IVendorDatatypeAttributes}) {
        let updated: IVendorDatatypeInstance;

        try {
            const vendorDatatype = await VendorDatatype.findById(args.id);
            if (!vendorDatatype) throw new Error('No such user found');
            updated = await vendorDatatype.update({...args.data}, {where: {id: args.id}});
        } catch (error) {
            console.log('Error:', error.message);
            return error;
        }

        return updated;
    },

    async delete(args: {id: number}) {
        let deleted: number;
        try {
            deleted = await VendorDatatype.destroy({where: {id: args.id}});
            if (!deleted) throw new Error('Couldn\'t be deleted');
        } catch (error) {
            console.log('Error:', error.message);
            return error;
        }

        return {success: true, message: 'Deleted Successfully'};
    },
};