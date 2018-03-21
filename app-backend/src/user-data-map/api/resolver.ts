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

export const userDataMapResolver = {

  async get(args: {userId: string}): Promise<UserDataMapAttributes> {
    let userDataMapInstance: UserDataMapInstance;
    const {userId} = args;

    userDataMapInstance = await UserDataMap.findOne({where: {user_id: userId, vendor_data_type: 'precisely:genetics'}});

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
