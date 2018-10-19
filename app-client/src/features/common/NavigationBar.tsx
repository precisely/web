/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import Radium from 'radium';

import * as AuthUtils from 'src/utils/auth';
import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';


const logo = require('src/assets/logo/with-lines/small.png');


export interface NavigationBarState {
  backgroundColor?: string;
}


@Radium
export class NavigationBar extends React.Component {

  state: NavigationBarState = {
    backgroundColor: 'transparent',
  };

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
      <RW.NavLink id="loginStatus" href="#" onClick={clickHandler}>
        {helper()}
      </RW.NavLink>
    );
  }

  render() {
    const {backgroundColor} = this.state;
    navbarStyle.backgroundColor = backgroundColor;
    return (
      <RW.Container fluid={false} className="sticky-top">
        <RW.Navbar light={true} sticky="top" style={navbarStyle}>
          <RW.NavbarBrand href="/" style={navbarBrandStyle}>
            <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
            <span style={logoTextStyle}>Precise.ly</span>
          </RW.NavbarBrand>
          {this.renderMenu()}
        </RW.Navbar>
      </RW.Container>
    );
  }

  renderMenu() {
    return (
      <RW.Nav horizontal="true" style={navbarMenuStyle} className="ml-auto">
        <RW.NavItem>
          <RW.NavLink href="/about-us">About Us</RW.NavLink>
        </RW.NavItem>
        <RW.NavItem>
          <RW.NavLink href="/report/mecfs">MECFS Report</RW.NavLink>
        </RW.NavItem>
        <RW.NavItem>
          {this.renderLoginStatus()}
        </RW.NavItem>
      </RW.Nav>
    );
  }

}


const navbarHousingStyle: React.CSSProperties = {
  padding: '0px'
};

const navbarStyle: React.CSSProperties = {
  marginLeft: '-10000px',
  paddingLeft: '10000px',
  marginRight: '-10000px',
  paddingRight: '10000px',
  backgroundColor: 'transparent',
  letterSpacing: '-0.5px',
  transition: 'background-color 0.4s ease',
  textTransform: 'uppercase',
  flexDirection: 'row',
  zIndex: 1000000
};

const navbarBrandStyle: React.CSSProperties = {
  display: 'flex',
  verticalAlign: 'middle'
};

const navbarMenuStyle: React.CSSProperties = {
  lineHeight: '40px'
};

const logoStyle: React.CSSProperties = {
  width: '40px',
  height: '40px'
};

const logoTextStyle: React.CSSProperties = {
  ...Styles.fonts.helveticaThin,
  paddingLeft: '12px',
  height: '34px',
  fontSize: '34px',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '40px',
  color: Styles.colors.preciselyMagenta,
  letterSpacing: '0.01em',
  textTransform: 'none'
};
