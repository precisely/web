/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMap} from '../models/UserDataMap';
import {UserDataMapInstance, UserDataMapAttributes} from '../models/UserDataMap';

export interface ListFilters {
    limit?: number;
    offset?: number;
}

export const userDataMapResolver = {

    async list(args: ListFilters = {}): Promise<UserDataMapInstance[]> {
        let userDataMapInstances: UserDataMapInstance[];
        const {limit = 15, offset = 0} = args;

        try {
            userDataMapInstances = await UserDataMap.findAll({limit, offset});
        } catch (error) {
            console.log('UserDataMap-list:', error.message);
            return error;
        }
        
        return userDataMapInstances;
    },

    async getByUserId(args: {userId: string}): Promise<UserDataMapAttributes> {
        let userDataMapInstance: UserDataMapInstance;

        userDataMapInstance = await UserDataMap.findOne({where: {user_id: args.userId}});
        if (!userDataMapInstance) {
            throw new Error('No such user record found');
        }
        
        return userDataMapInstance.get({plain: true});
    },

    async findOrCreate(args: {userId: string, vendorDataType: string}): Promise<UserDataMapAttributes> {
        let userDataMapInstance: UserDataMapInstance;

        try {
            userDataMapInstance = await UserDataMap
                .findCreateFind({
                    where: {
                        user_id: args.userId,
                        vendor_data_type: args.vendorDataType,
                    }
                })
                .spread((user: UserDataMapInstance): UserDataMapInstance => {
                    /* 
                     *  findCreateFind returns [Instance, created]. Since we don't need created attribute,
                     *  returning the user instance directly
                     */ 

                    return user;
                });
        } catch (error) {
            console.log('UserDataMap-findOrCreate:', error.message);
            return error;
        }

        return userDataMapInstance.get({plain: true});
    }
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
    listUserDataMap: (root: any, args: ListFilters) => userDataMapResolver.list(args),
};

/* istanbul ignore next */
export const mutations = {
    findOrCreateUserDataMap: (root: any, args: {userId: string, vendorDataType: string}) => 
        userDataMapResolver.findOrCreate(args),
};
