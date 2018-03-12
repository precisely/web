/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {UserGenotypeSwitch} from 'src/components/report/UserGenotypeSwitch';
import {getUserDataByGene, hasMatchingSvnForGene} from 'src/containers/report/utils';
import {dummyData} from 'src/__tests__/src/containers/report/testData';

const unroll = require('unroll');
unroll.use(it);

describe('UserGenotypeSwitch tests', () => {

  const mockedRender: jest.Mock<void> = jest.fn<void>();

  getUserDataByGene = jest.fn().mockReturnValue([dummyData.userData.Items[0].attrs]);
  hasMatchingSvnForGene = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

  it('should not call the render method when the children are not present', () => {
    UserGenotypeSwitch({gene: 'demo', userData: dummyData.userData}, mockedRender);
    expect(mockedRender).not.toBeCalled();
  });

  unroll('It should render the children when the matching element is #condition', (
      done: () => void,
      args
    ) => {
    UserGenotypeSwitch(
      {__children: [{attrs: {svn: 'dummy'}}], gene: 'demo', userData: dummyData.userData},
      mockedRender
    );

    ['<div>', {'attrs': {'svn': 'dummy'}}, '</div>'].forEach(element => {
      expect(mockedRender).toBeCalledWith(element);
    });

    done();
  }, [ // tslint:disable-next-line
    ['condition'],
    ['found'],
    ['not found']
  ]);
});
