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
import {Homepage} from 'src/containers/homepage/Homepage';
import {Footer} from 'src/components/Footer';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {Container} from 'src/components/ReusableComponents';

const scrollParallax = require('react-scroll-parallax');
const Parallax = scrollParallax.Parallax;
const ParallaxProvider = scrollParallax.ParallaxProvider;

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Homepage tests.', (): void => {

    const componentTree: ShallowWrapper = shallow(
        <Homepage />
    );

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['NavigationBar', NavigationBar, 1],
        ['ParallaxProvider', ParallaxProvider, 1],
        ['Container', Container, 2],
        ['Parallax', Parallax, 1],
        ['Footer', Footer, 1],
        ['img', 'img', 5],
        ['div', 'div', 9],
        ['h1', 'h1', 1],
        ['h3', 'h3', 3],
        ['h4', 'h4', 1],
        ['p', 'p', 6],
    ]);

});