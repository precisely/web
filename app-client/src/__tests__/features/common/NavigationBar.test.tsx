/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/constants/currentUser');

import * as React from 'react';
import * as Radium from 'radium';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Renderer from 'react-test-renderer';
import {ShallowWrapper, shallow, configure} from 'enzyme';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {currentUser} from 'src/constants/currentUser';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/__tests__/testSetup';

configure({adapter: new Adapter()});
Radium.TestMode.enable();

const navBarElement =
    (
      <NavigationBar 
        history={mockedHistory} 
        match={mockedMatch()} 
        location={mockedLocation} 
        staticContext={{}} 
      />
    );
describe('NavigationBar tests Snapshot Testing :', () => {
  it('renders correctly', () => {
    const tree = Renderer.create(navBarElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('NavigationBar Test After Login: ', () => {
  const componentTree: ShallowWrapper = shallow(navBarElement);

  it('should render Log In link in the navigation bar when the user is unauthenticated.', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });

  it(
    'should render Log Out link in the navigation bar when the user is authenticated after toggle button is clicked',
    () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('.navbar-toggler-right').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG OUT');
  });
});

describe('Login Test After Logout: ', () => {
  const componentTree: ShallowWrapper = shallow(navBarElement);
  it('should render Log In link in the navigation bar when the user is unauthenticated.', () => {
    currentUser[`__mockLogoutFailureCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });
});
