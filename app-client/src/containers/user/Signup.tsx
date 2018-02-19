/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {Button, Form, FormGroup, Input, Link} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {PageContent} from 'src/components/PageContent';
import {signup} from 'src/utils/cognito';
import {validateEmailAndPassword, showAlert} from 'src/utils';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {formButton, removeBorderRadius, inputStyle, header, loginAndSignupPanel} from 'src/constants/styleGuide';

export interface ISignupState {
    email?: string;
    password?: string;
    confirmPassword?: string;
    isLoading?: boolean;
}

@Radium
export class Signup extends React.Component<RouteComponentProps<void>, ISignupState> {

    toastId: number = null;

    state: ISignupState = {
        email: '',
        password: '',
        isLoading: false,
        confirmPassword: '',
    };

    updateLoadingState = (isLoading: boolean): void => {
        this.setState({isLoading});
    }

    onSuccess = (): void => {
        this.updateLoadingState(false);
        this.props.history.push('/login');
        this.toastId = showAlert(this.toastId, 'Please check your email to confirm your account.', 'success');
    }

    onFailure = (message: string = 'Unable to signup at this moment. Please try again later.'): void => {
        this.updateLoadingState(false);
        this.toastId = showAlert(this.toastId, message);
    }

    submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const {email, password, confirmPassword} = this.state;

        const validationInfo: {isValid: boolean, toastId: number} =
            validateEmailAndPassword(email, password, this.toastId);

        // This is needed to prevent multiple toast from getting rendered.
        this.toastId = validationInfo.toastId;

        if (validationInfo.isValid) {
            if (!confirmPassword) {
                this.toastId = showAlert(this.toastId, 'Please confirm your password.');
                return;
            }

            if (password !== confirmPassword) {
                this.toastId = showAlert(this.toastId, 'Password does not match the confirm password.');
                return;
            }

            this.updateLoadingState(true);
            signup(email, password, this.onSuccess, this.onFailure);
        }
    }

    handleInputChange(inputType: string, value: string): void {
        this.setState((): ISignupState => ({
            [inputType]: value,
        }));
    }

    render(): JSX.Element {
        const {isLoading, email, password, confirmPassword} = this.state;

        return (
            <div>
                <NavigationBar {...this.props} />
                <div className="mx-auto" style={loginAndSignupPanel}>
                    <h1 className="mt-5 mb-4" style={header}>Sign Up</h1>
                    <PageContent>
                        <Form id="signupForm" onSubmit={this.submitForm}>
                            <FormGroup style={formGroup} className="mb-0">
                                <Input
                                        style={removeBorderRadius}
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <FormGroup style={formGroup} className="mb-0">
                                <Input
                                        style={inputStyle}
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <FormGroup style={formGroup}>
                                <Input
                                        style={inputStyle}
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <Button style={formButton} disabled={isLoading} active={isLoading}>
                                {isLoading ? 'Please wait...' : 'Signup'}
                            </Button>
                        </Form>
                    </PageContent>
                    <div style={[linkFontSize, {textAlign: 'center'}]} className="mt-4">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const formGroup: CSS = {
    textAlign: 'left',
};

const linkFontSize: CSS = {
    fontSize: '14px',
};
