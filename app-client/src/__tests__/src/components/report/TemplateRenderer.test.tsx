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
import {TemplateRenderer, TemplateRendererProps} from 'src/components/report/TemplateRenderer';
import {dummyParsedContent, dummyData} from 'src/__tests__/src/containers/report/testData';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('TemplateRenderer tests.', () => {
  const componentTree: ShallowWrapper<TemplateRendererProps> =
      shallow(<TemplateRenderer parsedContent={dummyParsedContent} userData={dummyData.userData} />);

  it('should render the html div.', () => {
    expect(componentTree.find('div').length).toBe(1);
  });
});
