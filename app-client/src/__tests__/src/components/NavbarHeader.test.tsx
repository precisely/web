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
import {NavbarHeader} from 'src/components/navbarHeader/NavbarHeader';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'src/components/ReusableComponents';
import {logOut, isLoggedIn} from 'src/utils/cognito';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('NavbarHeader tests.', (): void => {
    const push: jest.Mock<void> = jest.fn<void>();
    const replace: jest.Mock<void> = jest.fn<void>();
    const mockedHistory: {push: jest.Mock<void>, replace: jest.Mock<void>} = {push, replace};

    const componentTree: ShallowWrapper = shallow(
        <NavbarHeader history={mockedHistory}/>
    );
        
    logOut = jest.fn<void>();
    isLoggedIn = jest.fn<boolean>()
        .mockImplementationOnce((): boolean => {
            return true;
        })
        .mockImplementation((): boolean => {
            return false;
        });

    it('should log out when logged in', (): void => {
        const componentTree: ShallowWrapper = shallow(
            <NavbarHeader history={mockedHistory}/>
        );
        componentTree.find(NavLink).at(1).simulate('click');
        expect(logOut).toBeCalled();
        expect(replace).toBeCalledWith('/');
    });

    it('should redirect to log in when logged out', (): void => {
        componentTree.find(NavLink).at(1).simulate('click');
        expect(replace).toBeCalledWith('/');
    });

    unroll('it should display #count #elementName elements', (
            done: () => void,
            args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
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

    it('should set the state of isOpen to true', (): void => {
        componentTree.find(NavbarToggler).simulate('click');
        expect(componentTree.state().isOpen).toBeTruthy();
    });

});