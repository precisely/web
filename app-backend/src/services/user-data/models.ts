/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {defineModel, Model, Item, types} from 'src/db/dynamo/dynogels';

export interface DataBridgeAttributes {
  userId?: string;
  vendorDataType?: string;
  opaqueId?: string;
}

export interface DataBridge extends Item<DataBridgeAttributes>, DataBridgeAttributes {
}

const StaticMethods = {
  async getOpaqueId(userId: string, key: string): Promise<string> {
    const dataBridge = await DataBridge.getAsync(userId, key);
    return dataBridge && dataBridge.get('opaqueId');
  },

  async forUser(userId: string): Promise<DataBridge[]> {
    const result = await DataBridge.query(userId).execAsync();
    return result && result.Items;
  }
};

export interface DataBridgeModel extends Model<DataBridgeAttributes> {
  getOpaqueId?(userId: string, key: string): Promise<string>;
  forUser?(userId: string): Promise<DataBridge[]>;
}

export const DataBridge: DataBridgeModel = defineModel<DataBridgeAttributes>('report', 1, {
  hashKey: 'userId',
  rangeKey: 'key',

  timestamps : true,

  schema: {
    userId: types.uuid(),
    key: Joi.string().required(),
    opaqueId: types.uuid().required()
  },
}, StaticMethods);
