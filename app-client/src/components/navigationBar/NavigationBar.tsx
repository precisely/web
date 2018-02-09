/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {logOut, isLoggedIn} from 'src/utils/cognito';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'src/components/ReusableComponents';
import 'src/components/navigationBar/NavigationBar.css';

const logo = require('src/assets/logo-horizontal.png');

export interface INavigationBarState {
    isOpen: boolean;
}

@Radium
export class NavigationBar extends React.Component<RouteComponentProps<void>, INavigationBarState> {
    state = {
        isOpen: false
    };

    toggle = (): void => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleClick = (loggedIn: boolean): void => {
        if (loggedIn) {
            logOut();
            this.props.history.replace('/');
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        const loggedIn: boolean = isLoggedIn();
        
        return (
            <Navbar light sticky="top" expand="md" toggleable="md" className="navbar">
              <NavbarBrand href="/"><img src={logo} alt="precise.ly" /></NavbarBrand>
              <NavbarToggler className="navbar-toggler-right" onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem className="pr-4">
                    <NavLink href="/components/">ABOUT US</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink style={{cursor: 'pointer'}} onClick={() => this.handleClick(loggedIn)}>
                      {loggedIn ? 'LOG OUT' : 'LOG IN'}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
        );
    }
}
