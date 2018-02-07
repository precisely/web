import { sequelize } from '../sequelize';
import {IVendorDatatypeInstance} from 'src/userDataMapper/vendorDatatype/VendorDatatype';

const VendorDatatype = sequelize[`VendorDatatype`];

export const VendorDatatypeResolver = {

    async create(args: {vendor: string, data_type: string}) {
        let vendorDatatypeInstance: any;
        try {
            vendorDatatypeInstance = await VendorDatatype.create({
                vendor: args.vendor,
                data_type: args.data_type
            });
        } catch (err) {
            console.log('Error:', err.message);
        }
        
        return vendorDatatypeInstance.get({plain: true});
    },

    async list() {
        const vendorDatatypeInstances = await VendorDatatype.findAll({raw: true});
        return vendorDatatypeInstances;
    },
    
    async get(args: {id: number}) {
        let vendorDatatypeInstance: IVendorDatatypeInstance;
        try {
            vendorDatatypeInstance = await VendorDatatype.findById(args.id);
        } catch (error) {
            console.log('Error:', error.message);
        }

        if (!vendorDatatypeInstance) {
            throw new Error('No such user found');
        }

        return vendorDatatypeInstance;
    },

    async delete(args: {id: number}) {
        let vendorDatatypeInstance: any;
        try {
            vendorDatatypeInstance = await VendorDatatype.destroy({
                where: {id: args.id}
            });
        } catch (err) {
            console.log('Error:', err.message);
        }

        if (!vendorDatatypeInstance) {
            return {success: false, message: 'Couldn\'t be deleted'};
        }

        return {success: true, message: 'Deleted Successfully'};
    },
};
