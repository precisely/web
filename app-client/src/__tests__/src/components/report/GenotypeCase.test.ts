/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {GenotypeCase} from 'src/components/report/GenotypeCase';

describe('GenotypeCase tests', () => {
  
  const mockedRender: jest.Mock<void> = jest.fn<void>();

  it('should call the render method.', () => {
    GenotypeCase({__children: 'test'}, mockedRender);

    ['<div>', 'test', '</div>'].forEach(element => {
      expect(mockedRender).toBeCalledWith(element);
    });
  });
});
