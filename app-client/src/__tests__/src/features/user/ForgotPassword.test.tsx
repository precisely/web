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
import {ForgotPassword, ForgotPasswordState} from 'src/features/user/ForgotPassword';
import {Button, Form, FormGroup} from 'src/features/common/ReusableComponents';
import {getResetPasswordCode} from 'src/utils/cognito';
import {PageContent} from 'src/features/common/PageContent';
import {Email} from 'src/features/common/Email';
import {utils} from 'src/utils/index';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for ForgotPassword', () => {

  Radium.TestMode.enable();

  beforeEach(() => {
    utils.showAlert = jest.fn<number>().mockReturnValue(1);
    mockedHistory.push = jest.fn<void>();
  });

  getResetPasswordCode = jest.fn<void>()
      .mockImplementationOnce((
          email: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ): Promise<void> => {
        return new Promise((resolve, reject): void => {
          resolve(successCallback());
        });
      })
      .mockImplementationOnce((
          email: string,
          successCallback?: () => void,
          failureCallback?: () => void
      ): Promise<void> => {
        return new Promise((resolve, reject): void => {
          reject(failureCallback());
        });
      });

  const preventDefault: jest.Mock<void> = jest.fn<void>();

  const componentTree: ShallowWrapper<RouteComponentProps<void>, ForgotPasswordState> = shallow(
      <ForgotPassword history={mockedHistory} match={mockedMatch()} location={mockedLocation} />
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
    ['FormGroup', FormGroup, 1],
    ['Email', Email, 1],
    ['SignupLoginContainer', PageContent, 1]
  ]);

  it('should not submit the form when the email is not present.', () => {
    componentTree.find(Form).simulate('submit', {preventDefault});
    expect(utils.showAlert).toBeCalledWith(null, 'Please enter your email.');
    expect(getResetPasswordCode).not.toBeCalled();
  });

  unroll('It should change state value onChange of #id', (
      done: () => void,
      args: {id: string, value: string}
  ) => {
    componentTree.find(Email).simulate('change', {target: {id: args.id, value: args.value}});
    expect(componentTree.state(args.id)).toEqual(args.value);
    done();
  }, [ // tslint:disable-next-line
    ['id', 'value'],
    ['email', 'dummy@user.com'],
  ]);

  it('should change the route to the dashboard when the form is submitted successfully.', async () => {
    await componentTree.find(Form).simulate('submit', {preventDefault});
    expect(mockedHistory.push).toBeCalledWith('/reset-password/dummy@user.com');
  });
});
