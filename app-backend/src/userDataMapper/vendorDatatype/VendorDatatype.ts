import * as Sequelize from 'sequelize';

export interface IVendorDatatypeAttributes {
    vendor: string;
    data_type: string;
}

export interface IVendorDatatypeInstance extends Sequelize.Instance<IVendorDatatypeAttributes>, IVendorDatatypeAttributes {
    id: number;
}

export const VendorDatatype = (sequelize: Sequelize.Sequelize): 
        Sequelize.Model<IVendorDatatypeInstance, IVendorDatatypeAttributes> => {

    const VendorDatatype: Sequelize.Model<IVendorDatatypeInstance, IVendorDatatypeAttributes> =
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
    VendorDatatype[`associate`] = (models: {[index: string]: Sequelize.Model<Sequelize.Instance<any>, any>}) => {
    	VendorDatatype.hasOne(models[`UserDataMap`], {foreignKey: 'vendor_data_type_id'});
    }

    return VendorDatatype;
}