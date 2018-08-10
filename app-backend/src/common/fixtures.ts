/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:51:47 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:51:47 
 */

import { Item } from '@aneilbaboo/dynogels-promisified';
import * as dynogels from '@aneilbaboo/dynogels-promisified';
// tslint:disable:no-any
type AnyItem = Item<any, any>;
var rememberedFixtures: AnyItem[] = [];
/**
 * Parallel-saves one or more dynogels objects, and remembers them as fixtures
 * @param newFixtures
 * @param restFixtures
 */
export async function addFixtures(...fixtures: AnyItem[]) {
  const savedFixtures: AnyItem[] = await Promise.all(fixtures.map(f => f.saveAsync()));

  return rememberFixtures(...savedFixtures);
}

/**
 *
 * @param fixtures
 */
export function rememberFixtures(...fixtures: AnyItem[]) {
  rememberedFixtures = [...fixtures, ...rememberedFixtures];
  return fixtures;
}

/**
 * Destroys all remembered fixtures, and clears the fixture list
 */
export async function destroyFixtures() {
  await Promise.all(rememberedFixtures.map((f: any) => f.destroyAsync()));
  rememberedFixtures = [];
}

export async function resetAllTables() {
  if (process.env.STAGE === 'prod') {
    throw new Error('Refusing to clear tables on prod');
  }
  await Promise.all(Object.values(dynogels.models).map(async model => {
    await model.deleteTableAsync();
    await model.createTableAsync();
  }));
}
