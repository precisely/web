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
  isOpen: boolean;
}


@Radium
export class NavigationBar extends React.Component {

  state: NavigationBarState = {
    backgroundColor: 'transparent',
    isOpen: false
  };

  componentDidMount(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.setState({backgroundColor: window.scrollY > 50 ? Styles.colors.white : 'transparent'});
  }

  toggleNavbar = (): void => {
    this.setState({isOpen: !this.state.isOpen});
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

  renderStyle() {
    return [
      <Radium.Style key="1" scopeSelector=".navbar-collapse.collapsing" rules={navbarHousingStyle} />,
      <Radium.Style key="2" scopeSelector=".nav-link" rules={navlinkStyle} />
    ];
  }

  render() {
    const {backgroundColor} = this.state;
    navbarStyle.backgroundColor = backgroundColor;
    // The <style> tags below enforces centering for the menu during the collapsing
    // animation. Not truly scoped, unfortunately.
    return (
      <RW.Container fluid={false} className="sticky-top">
        {this.renderStyle()}
        <RW.Navbar light={true} sticky="top" expand="md" style={navbarStyle}>
          <RW.NavbarBrand href="/" style={navbarBrandStyle}>
            <img id="brand-logo" src={logo} alt="precise.ly" style={logoStyle} />
            <span style={logoTextStyle}>Precise.ly</span>
          </RW.NavbarBrand>
          <RW.NavbarToggler onClick={this.toggleNavbar} style={navbarTogglerStyle} />
          {this.renderMenu()}
        </RW.Navbar>
      </RW.Container>
    );
  }

  renderMenu() {
    return (
      <RW.Collapse navbar={true} isOpen={this.state.isOpen} style={this.state.isOpen && navbarHousingStyle}>
        <RW.Nav horizontal="true" style={navbarMenuStyle}>
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
      </RW.Collapse>
    );
  }

}


const navbarHousingStyle: React.CSSProperties = {
  display: 'inline-flex'
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

const navbarTogglerStyle: React.CSSProperties = {
  lineHeight: '40px'
};

const navbarMenuStyle: Styles.ExtendedCSSProperties = {
  height: '100%',
  lineHeight: '40px',
  marginLeft: 'auto',
  '@media screen and (max-width: 770px)': {
    marginRight: 'auto'
  }
};

const navlinkStyle: React.CSSProperties = {
  paddingLeft: '0.5em',
  paddingRight: '0.5em'
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
