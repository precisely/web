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
import {RouteComponentProps} from 'react-router';
import {NavigationBar, NavigationBarState} from 'src/components/navigationBar/NavigationBar';
import {logOut, isLoggedIn} from 'src/utils/cognito';
import {mockedHistory} from 'src/__tests__/testSetup.ts';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'src/components/ReusableComponents';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

type ComponentTree = ShallowWrapper<RouteComponentProps<{email: string} | void>, NavigationBarState>;

describe('NavigationBar tests.', () => {

    logOut = jest.fn<void>();
    isLoggedIn = jest.fn<boolean>()
        .mockImplementationOnce((): boolean => {
            return true;
        })
        .mockImplementation((): boolean => {
            return false;
        });

    const getComponentTree = (): ComponentTree => {
        return shallow(<NavigationBar history={mockedHistory} />);
    };

    describe('When user is logged in', () => {
        const componentTree: ComponentTree = getComponentTree();

        it('should log out when button is clicked', () => {
            componentTree.find(NavLink).at(1).simulate('click');
            expect(logOut).toBeCalled();
            expect(mockedHistory.replace).toBeCalledWith('/');
        });
    });

    describe('When user is logged out', () => {
        const componentTree: ComponentTree = getComponentTree();

        it('should redirect to login page when button is clicked', () => {
            componentTree.find(NavLink).at(1).simulate('click');
            expect(mockedHistory.replace).toBeCalledWith('/');
        });
    
        unroll('it should display #count #elementName elements', (
                done: () => void,
                args: {elementName: string, element: EnzymePropSelector, count: number}
        ) => {
            expect(componentTree.find(args.element).length).toBe(args.count);
            done();
        }, [ // tslint:disable-next-line
            ['elementName', 'element', 'count'],
            ['Navbar', Navbar, 1],
            ['NavbarBrand', NavbarBrand, 1],
            ['NavbarToggler', NavbarToggler, 1],
            ['Collapse', Collapse, 1],
            ['Nav', Nav, 1],
            ['NavItem', NavItem, 2],
            ['NavLink', NavLink, 2],
        ]);
    
        it('should set the state of isOpen to true', () => {
            componentTree.find(NavbarToggler).simulate('click');
            expect(componentTree.state().isOpen).toBeTruthy();
        });
    });

    describe('When the handleScroll is executed.', () => {

        const componentTree: ComponentTree = getComponentTree();

        unroll('it should set the background color to #color when the scrollY position is #scrollY', (
                done: () => void,
                args: {scrollY: number, color: string}
        ) => {
            Object.defineProperty(window, 'scrollY', {value: args.scrollY, writable: true});
            componentTree.instance()[`handleScroll`]();
            expect(componentTree.state().backgroundColor).toBe(args.color);
            done();
        }, [ // tslint:disable-next-line
            ['scrollY', 'color'],
            [100, 'white'],
            [20, 'transparent'],
        ]);
    });
});
