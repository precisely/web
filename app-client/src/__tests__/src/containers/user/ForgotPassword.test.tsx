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
import {ForgotPassword, IForgotPasswordState} from 'src/containers/user/ForgotPassword';
import {Button, Form, FormGroup, Input} from 'src/components/ReusableComponents';
import {getResetPasswordCode} from 'src/utils/cognito';
import {SignupLoginContainer} from 'src/components/PageContent';
import {showAlert} from 'src/utils';
import {mockedHistory} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for ForgotPassword', (): void => {

    Radium.TestMode.enable();

    beforeEach((): void => {
        showAlert = jest.fn<number>().mockReturnValue(1);
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

    const componentTree: ShallowWrapper<RouteComponentProps<void>, IForgotPasswordState> = shallow(
            <ForgotPassword history={mockedHistory} />
    );

    unroll('it should display #count #elementName elements', (
        done: () => void,
        args: {elementName: string, element: EnzymePropSelector, count: number}
    ): void => {
        expect(componentTree.find(args.element).length).toBe(args.count);
        done();
    }, [ // tslint:disable-next-line
        ['elementName', 'element', 'count'],
        ['Form', Form, 1],
        ['Button', Button, 1],
        ['FormGroup', FormGroup, 1],
        ['Input', Input, 1],
        ['SignupLoginContainer', SignupLoginContainer, 1]
    ]);

    it('should not submit the form when the email is not present.', (): void => {
        componentTree.find(Form).simulate('submit', {preventDefault});
        expect(showAlert).toBeCalledWith(null, 'Please enter your email.');
        expect(getResetPasswordCode).not.toBeCalled();
    });

    unroll('It should change state value onChange of #id', (
            done: () => void,
            args: {id: string, value: string}
    ): void => {
        componentTree.find(`#${args.id}`).simulate('change', {target: {id: args.id, value: args.value}});
        expect(componentTree.state(args.id)).toEqual(args.value);
        done();
    }, [ // tslint:disable-next-line
        ['id', 'value'],
        ['email', 'dummy@user.com'],
    ]);

    it('should change the route to the dashboard when the form is submitted successfully.', async (): Promise<void> => {
        await componentTree.find(Form).simulate('submit', {preventDefault});
        expect(mockedHistory.push).toBeCalledWith('/reset-password/dummy@user.com');
    });
});
