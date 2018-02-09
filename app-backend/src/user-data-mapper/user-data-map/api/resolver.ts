/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {sequelize} from 'src/user-data-mapper/sequelize';
import {IUserDataMapInstance} from 'src/user-data-mapper/user-data-map/models/UserDataMap';

const UserDataMap = sequelize[`UserDataMap`];
const VendorDatatype = sequelize[`VendorDatatype`];

export const UserDataMapResolver = {

    async list() {
        return await UserDataMap.findAll({include: [{model: VendorDatatype, as: 'vendor_data_type'}]});
    },

    async create(args: {user_id: string, vendor_data_type_id: number}) {
        let userDataMapInstance: IUserDataMapInstance;
        const {user_id, vendor_data_type_id} = args;

        try {
            userDataMapInstance = await UserDataMap.create({
                user_id,
                vendor_data_type_id,
            });
        } catch (error) {
            console.log('UserDataMap-Create:', error.message);
            return error;
        }

        return userDataMapInstance.get({plain: true});
    },

    async getUserDataMap(args: {data_type_user_id: string, user_id: string, vendor_data_type_id: string}) {
        let userDataMapInstance: IUserDataMapInstance;
        const {data_type_user_id, user_id, vendor_data_type_id} = args;

        const where = {};

        if (data_type_user_id) {
            where[`data_type_user_id`] = data_type_user_id;
        } else if (user_id && vendor_data_type_id) {
            where[`user_id`] = user_id;
            where[`vendor_data_type_id`] = vendor_data_type_id;
        } else {
            return new Error('Missing Parameters. See documentation for details.')
        }

        try {
            userDataMapInstance = await UserDataMap.findOne({
                where,
                include: [{model: VendorDatatype, as: 'vendor_data_type'}]
            });
            if (!userDataMapInstance) {
                throw new Error('No such user data found')
            }
        } catch (error) {
            console.log('UserDataMap-getUserDataMap:', error.message);
            return error;
        }

        return userDataMapInstance.get({plain: true});
    },
};
