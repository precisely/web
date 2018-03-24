/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {genotypeResolver} from '../../../genotype-service/api/resolver';
import {userDataMapResolver, UserDataMapAttributes} from '../../../user-data-map/api/resolver';

export class UserData {

  constructor(userId: string, genes: string[]) {
    this.userId = userId;
    this.genes = genes;
  }

  private userDataMap: UserDataMapAttributes;
  private userId: string;
  private genes: string[];

  public genotypes = async() => {
    await this.getUserInstance();
    return genotypeResolver.list({opaqueId: this.userDataMap.opaqueId, genes: this.genes});
  }

  private getUserInstance = async () => {
    this.userDataMap = await userDataMapResolver.get({
      userId: this.userId,
    });
  }

}
