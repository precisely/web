/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {sequelize} from '../sequelize';
import {IUserDataMapInstance} from 'src/userDataMapper/userDataMap/UserDataMap';

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
            return error.message;
        }

        return userDataMapInstance.get({plain: true});
    },

    async getUserDataMapByDataType(args: {data_type_user_id: string}) {
        let userDataMapInstance: IUserDataMapInstance;
        const {data_type_user_id} = args;

        try {
            userDataMapInstance = await UserDataMap.findOne({
                where: {data_type_user_id},
                include: [{model: VendorDatatype, as: 'vendor_data_type'}]
            });
        } catch (error) {
            console.log('UserDataMap-getUserDataMapByDataType:', error.message);
            return error.message;
        }

        return userDataMapInstance.get({plain: true});
    },

    async getUserDataMapByUserAndVendor(args: {user_id: string, vendor_data_type_id: string}) {
        let userDataMapInstance: IUserDataMapInstance;
        const {user_id, vendor_data_type_id} = args;

        try {
            userDataMapInstance = await UserDataMap.findOne({
                where: {user_id, vendor_data_type_id},
                include: [{model: VendorDatatype, as: 'vendor_data_type'}]
            });
        } catch (error) {
            console.log('UserDataMap-getUserDataMapByUserAndVendor:', error.message);
            return error.message;
        }

        return userDataMapInstance.get({plain: true});
    }
};
