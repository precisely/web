/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as Radium from 'radium';
import * as React from 'react';

import * as AuthUtils from 'src/utils/auth';
import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';


const logo = require('src/assets/logo/with-lines/small.png');


export interface NavigationBarState {
  isOpen?: boolean;
  backgroundColor?: string;
}


@Radium
export class NavigationBar extends React.Component {

  state: NavigationBarState = {
    isOpen: false,
    backgroundColor: Styles.colors.white,
  };

  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.setState({backgroundColor: window.scrollY > 50 ? Styles.colors.white : 'transparent'});
  }

  renderLoginStatus() {
    const props = this.props;
    function helper() {
      return AuthUtils.isAuthenticated() ? 'log out' : 'log in';
    }
    function clickHandler(): void {
      if (AuthUtils.isAuthenticated()) {
        AuthUtils.logout();
      } else {
        AuthUtils.login();
      }
    }
    return (
      <RW.NavLink id="loginStatus" style={{cursor: 'pointer'}} onClick={clickHandler}>
        {helper()}
      </RW.NavLink>
    );
  }

  render() {
    const {backgroundColor} = this.state;

    navBar.backgroundColor = backgroundColor;

    return (
      <RW.Navbar light={true} sticky="top" expand="md" className="navbar" style={navBar}>
        <RW.NavbarBrand href="/">
          <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
          <span style={logoTextStyle}>Precise.ly</span>
        </RW.NavbarBrand>
        {... this.renderMenu()}
      </RW.Navbar>
    );
  }

  renderMenu() {
    const {isOpen} = this.state;

    return [
      <RW.NavbarToggler key="toggler" className="navbar-toggler-right" onClick={this.toggle} />,
      // tslint:disable-next-line jsx-wrap-multiline
      <RW.Collapse key="collapse" isOpen={isOpen} navbar={true}>
        <RW.Nav className="ml-auto" navbar={true}>
          <RW.NavItem className="pr-4">
            <RW.NavLink href="/about-us">About Us</RW.NavLink>
          </RW.NavItem>
          <RW.NavItem className="pr-4">
            <RW.NavLink href="/report/mecfs">MECFS Report</RW.NavLink>
          </RW.NavItem>
          <RW.NavItem>
            {this.renderLoginStatus()}
          </RW.NavItem>
        </RW.Nav>
      </RW.Collapse>
    ];
  }

}

const logoStyle: React.CSSProperties = {
  width: '26px',
};

const logoTextStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  paddingLeft: '4px',
  // width: '89px',
  height: '24px',
  fontSize: '20px',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  // letterSpacing: 'normal',
  color: Styles.colors.preciselyMagenta,
  // letterSpacing: '-0.6px',
  textTransform: 'none'
};

const navBar: Styles.ExtendedCSSProperties = {
  letterSpacing: '-1px',
  transition: 'background-color 0.4s ease',
  '@media screen and (min-width: 992px)': {
    padding: '8px 245px',
  },
  textTransform: 'uppercase',
  zIndex: 1000000
};
