/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, configure, EnzymePropSelector} from 'enzyme';
import {Footer} from 'src/features/common/Footer';
import {Col} from 'src/features/common/RadiumWrappers';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Footer tests.', () => {

  const componentTree: ShallowWrapper = shallow(<Footer />);

  unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
  ) => {
    expect(componentTree.find(args.element).length).toBe(args.count);
    done();
  }, [
    ['elementName', 'element', 'count'],
    ['div', 'div', 3],
    ['Col', Col, 6],
  ]);

});
