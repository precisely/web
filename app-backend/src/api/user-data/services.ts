/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Genotype} from 'src/api/genotype';
import {DataBridge} from './models';

type DataBridgeKey = 'precisely:genotype' | 'precisely:survey';

export type UserDataArguments = {
  userId: string,
  genes: string[],
  opaqueIdMap: {[key: string]: string}
};

export class UserData {
  constructor({userId, genes, opaqueIdMap}: UserDataArguments) {
    this.userId = userId;
    this.genes = genes;
    this.opaqueIdMap = opaqueIdMap;
  }

  private userId: string;
  private genes: string[];
  private opaqueIdMap: {[key: string]: string};

  async genotypes() {
    const opaqueId = await DataBridge.getOpaqueId(this.userId, 'precisely:genotype');
    return await Genotype.forUser(opaqueId, this.genes);
  }

  async getOpaqueId(key: DataBridgeKey): Promise<string> {
    if (this.opaqueIdMap && this.opaqueIdMap.hasOwnProperty(key)) {
      return this.opaqueIdMap[key];
    } else {
      const opaqueId = await DataBridge.getOpaqueId(this.userId, key);
      this.opaqueIdMap[key] = opaqueId;
      return opaqueId;
    }
  }
}
