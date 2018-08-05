/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import {addFixtures} from 'src/common/fixtures';

import {VariantCallAttributes, VariantCall} from './models';

export function addVariants(
  ...argsList: VariantCallAttributes[]
): Promise<VariantCall[]> {
  return addFixtures(...argsList.map(attrs => {
    return new VariantCall(<VariantCallAttributes> attrs);
  }));
}
