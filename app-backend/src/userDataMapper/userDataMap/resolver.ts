import { sequelize } from '../sequelize';

const UserDataMap = sequelize[`UserDataMap`];
const VendorDatatype = sequelize[`VendorDatatype`];

export const UserDataMapResolver = {
    async list() {
        const abc = await UserDataMap.findAll({include: [{model: VendorDatatype, as: 'vendor_data_type'}]});
        return abc;
    }
};
