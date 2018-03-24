/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Genotype} from 'src/features/genotype/models/Genotype';
import {UserDataMap} from '../models/UserDataMap';

export class UserData {

  constructor(userId: string, genes: string[]) {
    this.userId = userId;
    this.genes = genes;
  }

  private userId: string;
  private genes: string[];

  public async getGenotypes() {
    var opaqueId = await UserDataMap.getOpaqueId(this.userId, 'genotype');
    return await Genotype.getGenes({
      genes: this.genes,
      opaqueId: opaqueId
    });
  }
}
