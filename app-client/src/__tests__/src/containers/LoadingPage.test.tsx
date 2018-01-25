/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Radium from 'radium';
import * as Adapter from 'enzyme-adapter-react-16';
import * as FontAwesome from 'react-fontawesome';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {LoadingPage} from 'src/containers/LoadingPage';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});
Radium.TestMode.enable();

describe('Tests for LoadingPage', (): void => {
    const componentTree: ShallowWrapper = shallow(<LoadingPage />);

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['div', 'div', 2],
        ['Loading icon', FontAwesome, 1],
        ['Loading message', 'h4', 1],
    ]);
});
