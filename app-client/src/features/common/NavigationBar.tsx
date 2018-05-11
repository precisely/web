/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {currentUser} from 'src/constants/currentUser';
import {CSS} from 'src/interfaces';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'src/features/common/ReusableComponents';

const logo = require('src/assets/precisely-logo.png');

export interface NavigationBarState {
  isOpen?: boolean;
  backgroundColor?: string;
}

@Radium
export class NavigationBar extends React.Component {
  state = {
    isOpen: false,
    backgroundColor: 'transparent',
  };

  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  handleClick = (): void => {
    if (currentUser.isAuthenticated()) {
      currentUser.logout();
    } else {
      currentUser.showLogin();
    }
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.setState({backgroundColor: window.scrollY > 50 ? 'white' : 'transparent'});
  }

  render() {
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
              <NavLink style={{cursor: 'pointer'}} onClick={(): void => this.handleClick()}>
                {currentUser.isAuthenticated() ? 'LOG OUT' : 'LOG IN'}
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
