/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapService} from '../../../features/user-data/services/UserDataMapService';
import {GenotypeService} from '../../../features/genotype/services/GenotypeService';
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
