
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
import {HomePage} from 'src/features/homepage/HomePage';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {Container} from 'src/features/common/ReusableComponents';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/testUtils';

const scrollParallax = require('react-scroll-parallax');
const Parallax = scrollParallax.Parallax;
const ParallaxProvider = scrollParallax.ParallaxProvider;

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('HomePage tests.', () => {

  const componentTree: ShallowWrapper =
      shallow(<HomePage history={mockedHistory} match={mockedMatch()} location={mockedLocation} staticContext={{}} />);

  unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
  ) => {
    expect(componentTree.find(args.element).length).toBe(args.count);
    done();
  }, [
    ['elementName', 'element', 'count'],
    ['NavigationBar', NavigationBar, 1],
    ['ParallaxProvider', ParallaxProvider, 1],
    ['Container', Container, 3],
    ['Parallax', Parallax, 1],
    ['img', 'img', 5],
    ['div', 'div', 9],
    ['h1', 'h1', 1],
    ['h3', 'h3', 3],
    ['h4', 'h4', 1],
    ['p', 'p', 4],
  ]);

});
