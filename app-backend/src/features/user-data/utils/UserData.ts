/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as UserDataMapService from '../../../features/user-data/services/UserDataMap';
import * as GenotypeService from '../../../features/genotype/services/Genotype';
import {log} from '../../../logger';

export class UserData {

  constructor(userId: string, genes: string[]) {
    this.userId = userId;
    this.genes = genes;
  }

  private userId: string;
  private genes: string[];

  public async getGenotypes() {
    try {
      var opaqueId = await UserDataMapService.getOpaqueId(this.userId, 'precisely:genetics');
      return await GenotypeService.getGenotypes(opaqueId, this.genes);
    } catch (error) {
      log.error(`UserData-getGenotypes: ${error.message}`);
      throw error;
    }
  }
}
