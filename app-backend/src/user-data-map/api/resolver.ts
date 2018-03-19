/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMap} from '../models/UserDataMap';
import {UserDataMapInstance} from '../models/UserDataMap';
import {log} from '../../logger';

const camelcaseKeys = require('camelcase-keys');

export interface UserDataMapAttributes {
  userId: string;
  vendorDataType: string;
  opaqueId: string;
}

export interface ListUserDataMapFilters {
  limit?: number;
  offset?: number;
}

export const userDataMapResolver = {

  async list(args: ListUserDataMapFilters = {}): Promise<UserDataMapAttributes[]> {
    let userDataMapInstances: UserDataMapInstance[];
    const {limit = 15, offset = 0} = args;
    const result: UserDataMapAttributes[] = [];

    try {
      userDataMapInstances = await UserDataMap.findAll({limit, offset});
    } catch (error) {
      log.error(`UserDataMap-list: ${error.message}`);
      return error;
    }
    userDataMapInstances.forEach((userDataMapInstance) => {
      result.push(camelcaseKeys(userDataMapInstance.get({plain: true})));
    });
    
    return result;
  },

  async get(args: {userId: string, vendorDataType: string}): Promise<UserDataMapAttributes> {
    let userDataMapInstance: UserDataMapInstance;
    const {userId, vendorDataType} = args;

    userDataMapInstance = await UserDataMap.findOne({where: {user_id: userId, vendor_data_type: vendorDataType}});

    if (!userDataMapInstance) {
      throw new Error('No such user record found');
    }
    
    return camelcaseKeys(userDataMapInstance.get({plain: true}));
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
      log.error(`UserDataMap-findOrCreate: ${error.message}`);
      return error;
    }

    return camelcaseKeys(userDataMapInstance.get({plain: true}));
  }
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
};

/* istanbul ignore next */
export const mutations = {
  userDataMap: (root: any, args: {userId: string, vendorDataType: string}) => 
    userDataMapResolver.findOrCreate(args),
};
