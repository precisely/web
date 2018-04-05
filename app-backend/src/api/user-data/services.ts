/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Genotype} from 'src/features/genotype';
import {UserDataMap} from '../models/UserDataMap';

export class UserData {

  constructor(userId: string, genes: string[]) {
    this.userId = userId;
    this.genes = genes;
  }

  private userId: string;
  private genes: string[];

  public genotypes = async() => {
    const opaqueId = await UserData.getOpaqueId(this.userId, 'precisely:genotype');
    return await Genotype.getGenes({opaqueId, genes: this.genes});
  }
}
