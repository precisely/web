/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {RouteComponentProps} from 'react-router';
import {ShallowWrapper, shallow, configure, EnzymePropSelector} from 'enzyme';
import {AboutUs} from 'src/containers/homepage/AboutUs';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {PageContent} from 'src/components/PageContent';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('AboutUs tests.', () => {

    const componentTree: ShallowWrapper<RouteComponentProps<void>> = shallow(<AboutUs />);

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ) => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['NavigationBar', NavigationBar, 1],
        ['h2', 'h2', 1],
        ['h5', 'h5', 1],
        ['p', 'p', 5],
        ['PageContent', PageContent, 1]
    ]);
});
