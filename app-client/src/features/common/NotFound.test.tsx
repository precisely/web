/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as FontAwesome from 'react-fontawesome';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {NotFound} from 'src/features/common/NotFound';
import {Link} from 'src/features/common/RadiumWrappers';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for NotFound', () => {
  const componentTree: ShallowWrapper = shallow(<NotFound />);

  unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
  ) => {
    expect(componentTree.find(args.element).length).toBe(args.count);
    done();
  }, [
    ['elementName', 'element', 'count'],
    ['div', 'div', 2],
    ['Error icon', FontAwesome, 1],
    ['Error message', 'h4', 1],
    ['Link to the homepage', Link, 1],
  ]);
});
