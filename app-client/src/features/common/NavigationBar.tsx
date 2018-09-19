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
import * as AuthUtils from 'src/utils/auth';
import { ExtendedCSS, white, preciselyMagenta, helveticaFont, helveticaThinFont } from 'src/constants/styleGuide';

const logo = require('src/assets/logo.png');

export interface NavigationBarState {
  isOpen?: boolean;
  backgroundColor?: string;
}
@Radium
export class NavigationBar extends React.Component<RouteComponentProps<void>> {

  state: NavigationBarState = {
    isOpen: false,
    backgroundColor: 'transparent',
  };

  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.setState({backgroundColor: window.scrollY > 50 ? white : 'transparent'});
  }

  renderLoginStatus() {
    const props = this.props;
    function helper() {
      return AuthUtils.isAuthenticated() ? 'log out' : 'log in';
    }
    function clickHandler(): void {
      if (AuthUtils.isAuthenticated()) {
        AuthUtils.logout();
      }
      else {
        props.history.push('/login');
      }
    }
    return (
      <NavLink id="loginStatus" style={{cursor: 'pointer'}} onClick={clickHandler}>
        {helper()}
      </NavLink>
    );
  }

  render() {
    const {backgroundColor} = this.state;

    navBar.backgroundColor = backgroundColor;

    return (
      <Navbar light={true} sticky="top" expand="md" toggleable="md" className="navbar" style={navBar}>
        <NavbarBrand href="/">
          <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
          <span style={logoTextStyle}>Precise.ly</span>
        </NavbarBrand>
        {... this.renderMenu()}
      </Navbar>
    );
  }

  renderMenu() {
    const {isOpen} = this.state;

    return [
      <NavbarToggler key="toggler" className="navbar-toggler-right" onClick={this.toggle} />,
      // tslint:disable-next-line jsx-wrap-multiline
      <Collapse key="collapse" isOpen={isOpen} navbar={true}>
        <Nav className="ml-auto" navbar={true}>
          <NavItem className="pr-4">
            <NavLink href="/about-us">About Us</NavLink>
          </NavItem>
          <NavItem className="pr-4">
            <NavLink href="/report/mecfs">MECFS Report</NavLink>
          </NavItem>
          <NavItem>
            {this.renderLoginStatus()}
          </NavItem>
        </Nav>
      </Collapse>
    ];
  }

}

const logoStyle: CSS = {
  width: '26px',
};

const logoTextStyle: CSS = {
  ...helveticaThinFont,
  paddingLeft: '4px',
  // width: '89px',
  height: '24px',
  fontSize: '20px',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  // letterSpacing: 'normal',
  color: preciselyMagenta,
  // letterSpacing: '-0.6px',
  textTransform: 'none'
};

const navBar: ExtendedCSS = {
  letterSpacing: '-1px',
  transition: 'background-color 0.4s ease',
  '@media screen and (min-width: 992px)': {
    padding: '8px 245px',
  },
  textTransform: 'uppercase'
};
