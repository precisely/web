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
import {PageContent} from 'src/components/PageContent';
import {Row, Col} from 'src/components/ReusableComponents';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('SignupLoginContainer tests.', (): void => {

    const componentTree: ShallowWrapper = shallow(
        <PageContent>I am a dummy child.</PageContent>
    );

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['Row', Row, 1],
        ['Col', Col, 1],
    ]);

    it('should render the children correctly.', (): void => {
        expect(componentTree.contains('I am a dummy child.')).toBe(true);
    });
});
