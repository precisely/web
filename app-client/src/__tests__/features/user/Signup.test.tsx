/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/constants/currentUser');

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {ShallowWrapper, shallow, EnzymePropSelector, configure} from 'enzyme';
import {Signup, SignupState} from 'src/features/user/Signup';
import {Button, Form, FormGroup, Input, Link} from 'src/features/common/ReusableComponents';
import {currentUser} from 'src/constants/currentUser';
import {PageContent} from 'src/features/common/PageContent';
import {utils} from 'src/utils/index';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for Signup', () => {

  Radium.TestMode.enable();

  beforeEach(() => {
    utils.showAlert = jest.fn<number>().mockReturnValue(1);
  });

  utils.checkEmailAndPassword = jest.fn()
      .mockImplementationOnce(() => {
        return {isValid: false, toastId: 1};
      })
      .mockImplementation(() => {
        return {isValid: true, toastId: 1};
      });

  const preventDefault: jest.Mock<void> = jest.fn<void>();

  const componentTree: ShallowWrapper<RouteComponentProps<void>, SignupState> = shallow(
      <Signup history={mockedHistory} match={mockedMatch()} location={mockedLocation} />
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
    ['FormGroup', FormGroup, 3],
    ['Input', Input, 3],
    ['Link', Link, 1],
    ['SignupLoginContainer', PageContent, 1]
  ]);

  it('should not submit the form when the username and password are not valid.', () => {
    componentTree.find('#signupForm').simulate('submit', {preventDefault});
    expect(currentUser.signup).not.toBeCalled();
  });

  unroll('It should change state value onChange of #id', (
      done: () => void,
      args: {id: string, value: string}
  ) => {
    componentTree.find(`#${args.id}`).simulate('change', {target: {id: args.id, value: args.value}});
    expect(componentTree.state(args.id)).toEqual(args.value);
    done();
  }, [ // tslint:disable-next-line
    ['id', 'value'],
    ['email', 'dummyUsername'],
    ['password', 'dummyPassword'],
  ]);

  it('should not submit the form when the confirm password is null.', () => {
    componentTree.find('#signupForm').simulate('submit', {preventDefault});
    expect(utils.showAlert).toBeCalledWith(1, 'Please confirm your password.');
    expect(currentUser.signup).not.toBeCalled();
  });

  it('should not submit the form when the passwords are not same.', () => {
    componentTree.find(`#confirmPassword`)
        .simulate('change', {target: {id: 'confirmPassword', value: 'qwerty12345'}});
    componentTree.find('#signupForm').simulate('submit', {preventDefault});
    expect(utils.showAlert).toBeCalledWith(1, 'Password does not match the confirm password.');
    expect(currentUser.signup).not.toBeCalled();
  });

  it('should change the confirm password state value on change.', () => {
    componentTree.find(`#confirmPassword`)
        .simulate('change', {target: {id: 'confirmPassword', value: 'dummyPassword'}});
    expect(componentTree.state('confirmPassword')).toEqual('dummyPassword');
  });

  it('should change the route to the login when the form is submitted successfully.', async () => {
    currentUser[`__mockSignupSuccessCase`]();
    await componentTree.find('#signupForm').simulate('submit', {preventDefault});
    expect(mockedHistory.push).toBeCalledWith('/login');
  });

  it('should show an alert when the user is unable to signup.', async () => {
    currentUser[`__mockSignupFailureCase`]();
    await componentTree.find('#signupForm').simulate('submit', {preventDefault});
    expect(utils.showAlert).toBeCalledWith(1, 'Unable to signup');
  });
});