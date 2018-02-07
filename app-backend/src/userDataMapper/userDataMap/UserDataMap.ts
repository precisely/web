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

    const UserDataMap: Sequelize.Model<IUserDataMapInstance, IUserDataMapAttributes> =
            sequelize.define<IUserDataMapInstance, IUserDataMapAttributes>('userDataMap', {

        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },

        data_type_user_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }

    }, {
        tableName: 'userDataMap'
    });

    // Add your associations here
    UserDataMap[`associate`] = (models: {[index: string]: Sequelize.Model<Sequelize.Instance<any>, any>}) => {
    	UserDataMap.belongsTo(models[`VendorDatatype`], {as: 'vendor_data_type', foreignKey: 'vendor_data_type_id'});
    }

    return UserDataMap;
}