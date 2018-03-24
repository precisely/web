/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Sequelize from 'sequelize';
import {connection} from 'src/data-source/postgres/connections';

export interface UserDataMapAttributes {
  user_id: string;
  vendor_data_type: string;
  opaque_id: string;
}

export interface UserDataMapInstance extends Sequelize.Instance<UserDataMapAttributes>, UserDataMapAttributes {
    /// What is happening here?
}

export const vendorDataTypeList: string[] = [
  // Add vendorDataType here
  'precisely:demo',
  'precisely:test',
  'precisely:genotype',
];

export const UserDataMap: Sequelize.Model<UserDataMapInstance, UserDataMapAttributes> = 

    connection.define<UserDataMapInstance, UserDataMapAttributes>('userDataMap', {
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
