/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as fs from 'fs';
import * as path from 'path';
import * as Bluebird from 'bluebird';
import {UserDataMap, UserDataMapAttributes} from '../../user-data-map/models/UserDataMap';

const jsonPath = path.join(__dirname, '../data/');

export const seedUser = async () => {
  const promises: Bluebird<boolean>[] = [];
  const allUsers = JSON.parse(fs.readFileSync(jsonPath + 'UserData.json', 'utf8'));
  allUsers.forEach((user: UserDataMapAttributes) => {
    promises.push(UserDataMap.upsert(user));
  });
  await Promise.all(promises);
  process.exit();
};
