/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {Login, LoginState} from 'src/features/user/Login';
import {Button, Form, FormGroup, Input, Link} from 'src/features/common/ReusableComponents';
// import {login} from 'src/utils/cognito';
import {PageContent} from 'src/features/common/PageContent';
import {utils} from 'src/utils/index';
import {Email} from 'src/features/common/Email';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for Login', () => {

  Radium.TestMode.enable();

  beforeEach(() => {
    // showAlert = jest.fn<number>().mockReturnValue(1);
    mockedHistory.push = jest.fn<void>();
  });

  // login = jest.fn<void>()
  //     .mockImplementationOnce((
  //       email: string,
  //       password: string,
  //       successCallback?: () => void,
  //       failureCallback?: () => void
  //     ): Promise<void> => {
  //       return new Promise((resolve, reject): void => {
  //         return resolve(successCallback());
  //       });
  //     })
  //     .mockImplementationOnce((
  //       email: string,
  //       password: string,
  //       successCallback?: () => void,
  //       failureCallback?: () => void
  //     ): Promise<void> => {
  //       return new Promise((resolve, reject): void => {
  //         return reject(failureCallback());
  //       });
  //     });


  utils.checkEmailAndPassword = jest.fn()
      .mockImplementationOnce(() => {
        return {isValid: false, toastId: 1};
      })
      .mockImplementation(() => {
        return {isValid: true, toastId: 1};
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

  it('should not submit when checkEmailAndPassword fails.', () => {
    componentTree.find('#loginForm').simulate('submit', {preventDefault});
    expect(utils.checkEmailAndPassword).toBeCalled();
    // expect(login).not.toBeCalled();
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

  // it('should change the route to the dashboard when the form is submitted successfully.', async () => {
  //   await componentTree.find('#loginForm').simulate('submit', {preventDefault});
  //   expect(mockedHistory.push).toBeCalledWith('/dashboard');
  // });
});
