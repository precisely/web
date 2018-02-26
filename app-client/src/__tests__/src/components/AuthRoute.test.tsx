/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {Route, Redirect} from 'react-router-dom';
import {AuthRoute} from 'src/components/AuthRoute';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for AuthRoute', () => {
    const onEnter = jest.fn<boolean>((value: boolean): boolean => {
        return value;
    });

    describe('When onEnter returns true', () => {
        const componentTree: ShallowWrapper = shallow(
                <AuthRoute 
                        onEnter={(): void => onEnter(true)}
                        path="/dummyPath"
                        redirectTo="dummyRedirectPath"
                        exact
                />
        );

        it('should test for Route component', () => {
            expect(componentTree.find(Route).length).toBe(1);
        });
    });

    describe('When onEnter returns false', () => {
        const componentTree: ShallowWrapper = shallow(
                <AuthRoute 
                        onEnter={(): void => onEnter(false)}
                        path="/dummyPath"
                        redirectTo="dummyRedirectPath"
                        exact
                />
        );

        it('should test for Redirect component', () => {
            expect(componentTree.find(Redirect).length).toBe(1);
        });
    });

});
