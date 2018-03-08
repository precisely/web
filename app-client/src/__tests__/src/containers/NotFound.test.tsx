/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as FontAwesome from 'react-fontawesome';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {NotFound} from 'src/containers/NotFound';
import {Link} from 'src/components/ReusableComponents';

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
  }, [ // tslint:disable-next-line
    ['elementName', 'element', 'count'],
    ['div', 'div', 2],
    ['Error icon', FontAwesome, 1],
    ['Error message', 'h4', 1],
    ['Link to the homepage', Link, 1],
  ]);
});
