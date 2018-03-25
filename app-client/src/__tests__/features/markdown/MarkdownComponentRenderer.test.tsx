/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, configure} from 'enzyme';
import {dummyData} from 'src/__tests__/src/features/report/testData';
import {
  MarkdownComponentRenderer,
  MarkdownComponentRendererProps,
} from 'src/features/markdown/MarkdownComponentRenderer';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('MarkdownComponentRenderer tests.', () => {
  const componentTree: ShallowWrapper<MarkdownComponentRendererProps> =
      shallow(
        <MarkdownComponentRenderer
              parsedContent={dummyData.report.parsedContent}
              userData={dummyData.report.userData}
        />
      );

  it('should render the div element.', () => {
    expect(componentTree.find('div').length).toBe(1);
  });
});
