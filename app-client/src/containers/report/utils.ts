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
  let matchedUserData: UserData[] = [];

  if (allUserData) {
    allUserData.Items.forEach(userData => {
      if (gene === userData.attrs.gene) {
        matchedUserData.push(userData.attrs);
      }
    });
  }

  return matchedUserData;
};

export const hasMatchingSvnForGene = (svn: string, userData: UserData[]): boolean => {
  return userData.some(data => {
    return data.variant_call === svn;
  });
};
