/*
 * Copyright (c) 2011Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {getUserDataByGene, hasMatchingSvnForGene} from 'src/containers/report/utils';
import {dummyData} from 'src/__tests__/src/containers/report/testData';
import {UserDataList, UserData} from 'src/containers/report/interfaces';

describe('Report utils tests', () => {
  
  it('should return the matched user data.', () => {
    const result: UserData[] = getUserDataByGene('demo', dummyData.userData);
    expect(result).toEqual([dummyData.userData.Items[0].attrs]);
  });

  it('should check if the user data has the matching svn.', () => {
    const result: boolean = hasMatchingSvnForGene('dummy', [dummyData.userData.Items[0].attrs]);
    expect(result).toEqual(true);
  });
});
