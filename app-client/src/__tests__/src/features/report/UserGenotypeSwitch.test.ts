/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {UserGenotypeSwitch} from 'src/features/report/UserGenotypeSwitch';
import {dummyData, parsedContentJson} from 'src/__tests__/src/features/report/testData';

const unroll = require('unroll');
unroll.use(it);

describe('UserGenotypeSwitch tests', () => {

  const mockedRender: jest.Mock<void> = jest.fn<void>();

  beforeEach(() => {
    mockedRender.mockReset();
  });

  it('should not call the render method when the children are not present', () => {
    UserGenotypeSwitch({gene: 'demo', userData: dummyData.userData}, mockedRender);
    expect(mockedRender).not.toBeCalled();
  });

  it('should render the correct child when the matching gene is found', () => {
    UserGenotypeSwitch(
      {__children: parsedContentJson[`children`], gene: 'MTHFR', userData: dummyData.userData},
      mockedRender
    );

    const genotypeCase = {
      attrs: {svn: 'NC_000001.11:g.[11796322C>T];[11796322C>T]'},
      children: [{blocks: ['<p>Et esse debitis minus et saepe.</p>'], type: 'text'}],
      name: 'genotypecase',
      rawName: 'GenotypeCase',
      selfClosing: false,
      type: 'tag'
    };

    expect(mockedRender).toBeCalledWith(genotypeCase);
  });

  it('should render the fallback child when the matching gene is not found', () => {
    UserGenotypeSwitch(
      {__children: parsedContentJson[`children`], gene: 'TEST', userData: dummyData.userData},
      mockedRender
    );

    const genotypeCase = {
      attrs: {},
      children: [{blocks: ['<p>This is a fallback text.</p>'], type: 'text'}],
      name: 'genotypecase',
      rawName: 'GenotypeCase',
      selfClosing: false,
      type: 'tag'
    };

    expect(mockedRender).toBeCalledWith(genotypeCase);
  });
});
