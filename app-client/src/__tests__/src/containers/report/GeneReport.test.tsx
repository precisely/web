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
import {GeneReportImpl, GeneReportProps} from 'src/containers/report/GeneReport';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {PageContent} from 'src/components/PageContent';
import {Container} from 'src/components/ReusableComponents';
import {store} from 'src/store';
import {setLoadingState} from 'src/containers/report/actions';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('GeneReport tests.', () => {

    store.dispatch = jest.fn();

    describe('When the report data is loading.', () => {
        const componentTree: ShallowWrapper<GeneReportProps> = shallow(<GeneReportImpl isLoading={true} />);

        it('should dispatch an action to set the loading state before the component is mounted', () => {
            expect(store.dispatch).toHaveBeenCalledWith(setLoadingState());
        });

        unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
        ) => {
            expect(componentTree.find(args.element).length).toBe(args.count);
            done();
        }, [ // tslint:disable-next-line
            ['elementName', 'element', 'count'],
            ['NavigationBar', NavigationBar, 1],
            ['h1', 'h1', 1],
            ['Container', Container, 1],
            ['PageContent', PageContent, 1]
        ]);

        it('should display a loading message.', () => {
            expect(componentTree.contains('Fetching data. Please wait...')).toBe(true);
        });
    });

    describe('When the report data is not loading.', () => {
        const componentTree: ShallowWrapper<GeneReportProps> = shallow(<GeneReportImpl isLoading={false} />);

        it('should display a loading message.', () => {
            expect(componentTree.contains('Data fetched.')).toBe(true);
        });
    });
});
