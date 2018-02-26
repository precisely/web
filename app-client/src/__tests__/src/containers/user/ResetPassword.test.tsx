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
import {ResetPassword, IResetPasswordState} from 'src/containers/user/ResetPassword';
import {Button, Form, FormGroup, Input} from 'src/components/ReusableComponents';
import {resetPassword} from 'src/utils/cognito';
import {PageContent} from 'src/components/PageContent';
import {showAlert} from 'src/utils';
import {mockedHistory} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

type ShallowWrapperType = ShallowWrapper<RouteComponentProps<{email: string}>, IResetPasswordState>;

describe('Tests for ResetPassword', () => {

    Radium.TestMode.enable();

    const preventDefault: jest.Mock<void> = jest.fn<void>();

    beforeEach((): void => {
        showAlert = jest.fn<number>().mockReturnValue(1);
        mockedHistory.push = jest.fn<void>();
    });

    resetPassword = jest.fn<void>()
            .mockImplementationOnce((
                    email: string,
                    verificationCode: string,
                    newPassword: string,
                    successCallback?: () => void,
                    failureCallback?: () => void
            ): Promise<void> => {
                return new Promise((resolve, reject): void => {
                    resolve(successCallback());
                });
            })
            .mockImplementationOnce((
                    email: string,
                    verificationCode: string,
                    newPassword: string,
                    successCallback?: () => void,
                    failureCallback?: () => void
            ): Promise<void> => {
                return new Promise((resolve, reject): void => {
                    reject(failureCallback());
                });
            });

    const getComponentTree = (params?: {email: string}): ShallowWrapperType => {
        return shallow(<ResetPassword history={mockedHistory} match={{params}}/>);
    };

    describe('When the email is not present in the params.', () => {
        it('should route to the forgot password page.', () => {
            getComponentTree();
            expect(mockedHistory.push).toBeCalledWith('/forgot-password');
        });

    });

    describe('When the email not present in the params.', () => {
        const componentTree: ShallowWrapperType = getComponentTree({email: 'test@example.com'});

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
            ['SignupLoginContainer', PageContent, 1]
        ]);

        it('should not submit the form when the passwords are not equal.', () => {
            componentTree.find(`#newPassword`).simulate('change', {target: {id: 'confirmPassword', value: 'dummy'}});
            componentTree.find(Form).simulate('submit', {preventDefault});
            expect(showAlert).toBeCalledWith(null, 'Password does not match.');
            expect(resetPassword).not.toBeCalled();
        });
    });

    describe('When the input fields are not empty.', () => {
        const componentTree: ShallowWrapperType = getComponentTree({email: 'test@example.com'});

        unroll('It should change state value onChange of #id', (
            done: () => void,
            args: {id: string, value: string}
        ) => {
            componentTree.find(`#${args.id}`).simulate('change', {target: {id: args.id, value: args.value}});
            expect(componentTree.state(args.id)).toEqual(args.value);
            done();
        }, [ // tslint:disable-next-line
            ['id', 'value'],
            ['verificationCode', '123456'],
            ['newPassword', 'dummy'],
            ['confirmPassword', 'dummy'],
        ]);

        it('should change the route to the login when the form is submitted successfully.', async () => {
            await componentTree.find(Form).simulate('submit', {preventDefault});
            expect(mockedHistory.push).toBeCalledWith('/login');
        });
    });
});
