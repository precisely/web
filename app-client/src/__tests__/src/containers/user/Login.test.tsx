/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {mockedHistory, mockedMatch, mockedLocation, mockedCheckEmailAndPassword} from 'src/__tests__/testSetup.ts';

jest.doMock('src/utils', () => ({
  checkEmailAndPassword: mockedCheckEmailAndPassword
}));

jest.mock('src/utils/cognito', () => ({
  login: jest.fn<void>()
      .mockImplementationOnce((email: string, password: string, successCallback?: () => void) => { successCallback(); })
      .mockImplementationOnce((
          email: string,
          password: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ) => {
        failureCallback();
      }),
}));

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {Login, LoginState} from 'src/containers/user/Login';
import {Button, Form, FormGroup, Input, Link} from 'src/components/ReusableComponents';
import {login} from 'src/utils/cognito';
import {PageContent} from 'src/components/PageContent';
import {checkEmailAndPassword} from 'src/utils';
import {Email} from 'src/components/Email';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for Login', () => {

  Radium.TestMode.enable();

  beforeEach(() => {
    mockedHistory.push = jest.fn<void>();
  });

  const preventDefault: jest.Mock<void> = jest.fn<void>();

  const componentTree: ShallowWrapper<RouteComponentProps<void>, LoginState> = shallow(
      <Login history={mockedHistory} match={mockedMatch()} location={mockedLocation} />
  );

  unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
  ) => {
    expect(componentTree.find(args.element).length).toBe(args.count);
    done();
  }, [ // tslint:disable-next-line
    ['elementName', 'element', 'count'],
    ['Form', Form, 1],
    ['Button', Button, 1],
    ['FormGroup', FormGroup, 2],
    ['Input', Input, 1],
    ['Email', Email, 1],
    ['Link', Link, 2],
    ['SignupLoginContainer', PageContent, 1]
  ]);

  it('should not submit the form when the username and password are not valid.', () => {
    componentTree.find('#loginForm').simulate('submit', {preventDefault});
    expect(checkEmailAndPassword).toBeCalledWith('', '', null);
    expect(login).not.toBeCalled();
  });

  unroll('It should change state value onChange of #id', (
      done: () => void,
      args: {id: string, value: string, selector: EnzymePropSelector}
  ) => {
    componentTree.find(args.selector).simulate('change', {target: {id: args.id, value: args.value}});
    expect(componentTree.state(args.id)).toEqual(args.value);
    done();
  }, [ // tslint:disable-next-line
    ['id', 'value', 'selector'],
    ['email', 'dummyUsername', Email],
    ['password', 'dummyPassword', Input]
  ]);

  it('should change the route to the dashboard when the form is submitted successfully.', async () => {
    await componentTree.find('#loginForm').simulate('submit', {preventDefault});
    expect(mockedHistory.push).toBeCalledWith('/dashboard');
  });
});
