/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import Anime from 'react-anime';
import  {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {TestMainPage} from '../../../components/TestMainPage';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for TestMainPage', (): void => {
    const componentTree: ShallowWrapper<{}, {}> = shallow<{}, {}> (
        <TestMainPage />
    );

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['div', 'div', 1],
        ['Anime', Anime, 1],
        ['img', 'img', 1],
        ['h3', 'h3', 1],
        ['code', 'code', 1]
    ]);
});
