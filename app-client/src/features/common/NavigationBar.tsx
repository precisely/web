/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
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
import { RouteComponentProps } from 'react-router';
// import * as AuthUtils from 'src/utils/auth';
let AuthUtils = require('src/utils/auth');
const LOGO = require('src/assets/precisely-logo.png');

export interface NavigationBarState {
  isOpen?: boolean;
  backgroundColor?: string;
}

@Radium
// tslint:disable-next-line
export class NavigationBar extends React.Component<RouteComponentProps<any>> {
  state = {
    isOpen: false,
    backgroundColor: 'transparent',
  };

  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  handleClick = (): void => {
    if (AuthUtils.isAuthenticated()) {
      AuthUtils.logout();
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
    const {isOpen, backgroundColor} = this.state;

    navBar.backgroundColor = backgroundColor;

    return (
      <Navbar light sticky="top" expand="md" toggleable="md" className="navbar" style={navBar}>
        <NavbarBrand href="/">
          <img id="brand-logo" src={LOGO} alt="precise.ly" style={logoStyle} />
        </NavbarBrand>
        <NavbarToggler className="navbar-toggler-right" onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem className="pr-4">
              <NavLink href="/about-us">ABOUT US</NavLink>
            </NavItem>
            <NavItem>
              <NavLink id="loginStatus" style={{cursor: 'pointer'}} onClick={(): void => this.handleClick()}>
                {AuthUtils.isAuthenticated() ? 'LOG OUT' : 'LOG IN'}
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
