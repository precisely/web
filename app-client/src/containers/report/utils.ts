/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {UserDataList, UserData} from 'src/containers/report/interfaces';

export const getUserDataByGene = (gene: string, allUserData: UserDataList): UserData[] => {
  // Using an array was necessary because gene is not a unique attribute in the model.
  return allUserData.Items.filter((userData) => gene === userData.attrs.gene).map((userData) => userData.attrs);
};

export const hasMatchingSvnForGene = (svn: string, userDataList: UserData[]): boolean => {
  return userDataList.some(data => {
    return data.variant_call === svn;
  });
};
