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
import {Signup, ISignupState} from 'src/containers/user/Signup';
import {Button, Form, FormGroup, Input, Link} from 'src/components/ReusableComponents';
import {signup} from 'src/utils/cognito';
import {SignupLoginContainer} from 'src/components/PageContent';
import {validateEmailAndPassword, showAlert} from 'src/utils';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for Signup', (): void => {

    Radium.TestMode.enable();

    beforeEach((): void => {
        showAlert = jest.fn<number>().mockReturnValue(1);
    });

    signup = jest.fn<void>()
            .mockImplementationOnce((
                email: string,
                password: string,
                successCallback?: () => void,
                failureCallback?: () => void
            ): Promise<void> => {
                return new Promise((resolve, reject): void => {
                    resolve(successCallback());
                });
            })
            .mockImplementationOnce((
                email: string,
                password: string,
                successCallback?: () => void,
                failureCallback?: () => void
            ): Promise<void> => {
                return new Promise((resolve, reject): void => {
                    reject(failureCallback());
                });
            });

    validateEmailAndPassword = jest.fn()
            .mockImplementationOnce(() => {
                return {isValid: false, toastId: 1};
            })
            .mockImplementation(() => {
                return {isValid: true, toastId: 1};
            });

    const preventDefault: jest.Mock<void> = jest.fn<void>();
    const mockedHistory: {push: jest.Mock<void>} = {
        push: jest.fn<void>(),
    };

    const componentTree: ShallowWrapper<RouteComponentProps<void>, ISignupState> = shallow(
            <Signup history={mockedHistory} />
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
        ['FormGroup', FormGroup, 3],
        ['Input', Input, 3],
        ['Link', Link, 1],
        ['SignupLoginContainer', SignupLoginContainer, 1]
    ]);

    it('should not submit the form when the username and password are not valid.', (): void => {
        componentTree.find('#signupForm').simulate('submit', {preventDefault});
        expect(signup).not.toBeCalled();
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
        ['email', 'dummyUsername'],
        ['password', 'dummyPassword'],
    ]);

    it('should not submit the form when the confirm password is null.', (): void => {
        componentTree.find('#signupForm').simulate('submit', {preventDefault});
        expect(showAlert).toBeCalledWith(1, 'Please confirm your password.');
        expect(signup).not.toBeCalled();
    });

    it('should change the confirm password state value on change.', (): void => {
        componentTree.find(`#confirmPassword`)
                .simulate('change', {target: {id: 'confirmPassword', value: 'dummyPassword'}});
        expect(componentTree.state('confirmPassword')).toEqual('dummyPassword');
    });

    it('should change the route to the dashboard when the form is submitted successfully.', async (): Promise<void> => {
        await componentTree.find('#signupForm').simulate('submit', {preventDefault});
        expect(mockedHistory.push).toBeCalledWith('/login');
    });
});
