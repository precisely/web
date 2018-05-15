/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
jest.mock('./../../../constants/currentUser');
import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { RouteComponentProps } from 'react-router';
import { ShallowWrapper, shallow, configure, EnzymePropSelector } from 'enzyme';
import { Login } from 'src/features/user/Login';
import {
  mockedHistory,
  mockedMatch,
  mockedLocation
} from 'src/__tests__/testSetup';
import { NavigationBar } from 'src/features/common/NavigationBar';
import { currentUser } from './../../../constants/currentUser';
import * as Radium from 'radium';

Radium.TestMode.enable();
const unroll = require('unroll');
unroll.use(it);

configure({ adapter: new Adapter() });

describe('Login tests Before Logging In : ', () => {
  const componentTree: ShallowWrapper<RouteComponentProps<void>> = shallow(
    <Login
      history={mockedHistory}
      match={mockedMatch()}
      location={mockedLocation}
    />
  );

  unroll(
    'it should display #count #elementName elements :',
    (
      done: () => void,
      args: { elementName: string; element: EnzymePropSelector; count: number }
    ) => {
      expect(componentTree.find(args.element).length).toBe(args.count);
      done();
    },
    [
      // tslint:disable-next-line
      ['elementName', 'element', 'count'],
      ['NavigationBar', NavigationBar, 1],
      ['h1', 'h1', 1]
    ]
  );
});

describe('Login tests After Logging In :', () => {
  currentUser[`__mockisAuthenticatedSuccessCase`]();
  const componentTree: ShallowWrapper<RouteComponentProps<void>> = shallow(
    <Login
      history={mockedHistory}
      match={mockedMatch()}
      location={mockedLocation}
    />
  );

  it('it should have History action as PUSH : ', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    expect(mockedHistory.action).toEqual('PUSH');
  });

  it('it should redirect if user is already logged in', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    expect(mockedHistory.location.pathname).toEqual('demoPathName');
  });
});
