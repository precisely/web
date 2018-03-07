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
import {CSS} from 'src/interfaces';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'src/components/ReusableComponents';

const logo = require('src/assets/precisely-logo.png');

export interface NavigationBarState {
  isOpen?: boolean;
  backgroundColor?: string;
}

@Radium
export class NavigationBar extends React.Component<RouteComponentProps<{email?: string} | void>, NavigationBarState> {
  state = {
    isOpen: false,
    backgroundColor: 'transparent',
  };

  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  handleClick = (loggedIn: boolean): void => {
    if (loggedIn) {
      logOut();
      this.props.history.replace('/');
    } else {
      this.props.history.push('/login');
    }
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.setState({backgroundColor: window.scrollY > 50 ? 'white' : 'transparent'});
  }

  render() {
    const loggedIn: boolean = isLoggedIn();
    const {isOpen, backgroundColor} = this.state;

    navBar.backgroundColor = backgroundColor;

    return (
      <Navbar light sticky="top" expand="md" toggleable="md" className="navbar" style={navBar}>
        <NavbarBrand href="/">
          <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
        </NavbarBrand>
        <NavbarToggler className="navbar-toggler-right" onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem className="pr-4">
              <NavLink href="/about-us">ABOUT US</NavLink>
            </NavItem>
            <NavItem>
              <NavLink style={{cursor: 'pointer'}} onClick={(): void => this.handleClick(loggedIn)}>
                {loggedIn ? 'LOG OUT' : 'LOG IN'}
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const logoStyle: CSS = {
  width: '10em',
};

const navBar: CSS = {
  letterSpacing: '-1px',
  transition: 'background-color 0.4s ease',
  '@media screen and (min-width: 992px)': {
    padding: '8px 245px',
  },
};
