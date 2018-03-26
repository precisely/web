/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';
import {database} from '../../../data-source/postgres/connections';

export interface UserDataMapAttributes {
  user_id: string;
  vendor_data_type: string;
  opaque_id: string;
}

export interface UserDataMapInstance extends Sequelize.Instance<UserDataMapAttributes>, UserDataMapAttributes {
    /// What is happening here?
}

export const vendorDataTypeList: string[] = [
  'precisely:genotype',
];

export const UserDataMap =

    database.define<UserDataMapInstance, UserDataMapAttributes>('userDataMap', {

      createdAt: 'created_at',
      updatedAt: 'updated_at',

      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'userIdAndVendorDataType'
      },

      opaque_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },

      vendor_data_type: {
        type: Sequelize.STRING,
        unique: 'userIdAndVendorDataType',
        validate: {
          isIn: {
            args: [vendorDataTypeList],
            msg: 'No such vendorDataType exists'
          }
        }
      }
    }, {
      tableName: 'user_data_map'
    }
  );
