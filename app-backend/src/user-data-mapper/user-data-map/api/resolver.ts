/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {sequelize} from '../../sequelize';
import {IUserDataMapInstance} from '../models/UserDataMap';

const UserDataMap = sequelize[`UserDataMap`];

export interface IListFilters {
    limit?: number;
    offset?: number;
}

export const UserDataMapResolver = {

    async list(args: IListFilters = {}) {
        let userDataMapInstances: IUserDataMapInstance[];
        const {limit = 15, offset = 0} = args;

        try {
            userDataMapInstances = await UserDataMap.findAll({limit, offset});
        } catch (error) {
            console.log('UserDataMap-list:', error.message);
            return error;
        }
        
        return await userDataMapInstances;
    },

    async findOrCreate(args: {user_id: string, vendor_data_type: string}) {
        let userDataMapInstance: IUserDataMapInstance;
        const {user_id, vendor_data_type} = args;

        try {
            userDataMapInstance = await UserDataMap
                .findCreateFind({
                    where: {
                        user_id,
                        vendor_data_type,
                    }
                })
                .spread((user: IUserDataMapInstance, created: boolean): IUserDataMapInstance => {
                    return user;
                });
        } catch (error) {
            console.log('UserDataMap-findOrCreate:', error.message);
            return error;
        }
        
        return userDataMapInstance.get({plain: true});
    }
};
