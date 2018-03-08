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
import {Basepage} from 'src/containers/basepage/Basepage';
import {Footer} from 'src/components/Footer';
import {Routes} from 'src/containers/Routes';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Basepage tests.', () => {

  const componentTree: ShallowWrapper = shallow(<Basepage />);

  unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
  ) => {
    expect(componentTree.find(args.element).length).toBe(args.count);
    done();
  }, [ // tslint:disable-next-line
    ['elementName', 'element', 'count'],
    ['Footer', Footer, 1],
    ['Routes', Routes, 1],
    ['div', 'div', 2],
  ]);
});
