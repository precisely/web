/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import {addFixtures} from 'src/common/fixtures';

import {VariantCallAttributes, VariantCall} from './models';
import { UserSample, UserSampleAttributes } from 'src/services/user-sample/models';

export function addVariants(
  ...argsList: VariantCallAttributes[]
): Promise<VariantCall[]> {
  return addFixtures(...argsList.map(attrs => {
    return new VariantCall(<VariantCallAttributes> attrs);
  }));
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function addUserSamples(
  userIds: string[], attrs: Omit<UserSampleAttributes, 'userId'>
): Promise<UserSample[]> {
  return addFixtures(...userIds.map(userId => {
    return new UserSample({ 
      userId, 
      id: `${userId}-seed-sample`, 
      seed: true,
      ... attrs });
  }));
}
