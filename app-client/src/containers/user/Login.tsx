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
import {SignupLoginContainer} from 'src/components/SignupLoginContainer';
import {login} from 'src/utils/cognito';
import {validateEmailAndPassword, showAlert} from 'src/utils';

export interface ILoginState {
    email?: string;
    password?: string;
    isLoading?: boolean;
}

@Radium
export class Login extends React.Component<RouteComponentProps<void>, ILoginState> {

    toastId: number = null;

    state: ILoginState = {email: '', password: '', isLoading: false};

    updateLoadingState = (isLoading: boolean): void => {
        this.setState({isLoading});
    }

    onSuccess = (): void => {
        this.updateLoadingState(false);
        this.props.history.push('/dashboard');
    }

    onFailure = (message: string = 'Unable to login.'): void => {
        this.updateLoadingState(false);
        this.toastId = showAlert(this.toastId, message);
    }

    submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const {email, password} = this.state;

        const validationInfo: {isValid: boolean, toastId: number} =
                validateEmailAndPassword(email, password, this.toastId);

        // This is needed to prevent multiple toast from getting rendered.
        this.toastId = validationInfo.toastId;

        if (validationInfo.isValid) {
            this.updateLoadingState(true);
            login(email, password, this.onSuccess, this.onFailure);
        }
    }

    handleInputChange(inputType: string, value: string): void {
        this.setState((): ILoginState => ({
            [inputType]: value,
        }));
    }

    render(): JSX.Element {
        const {isLoading, email, password} = this.state;

        return (
            <SignupLoginContainer>
                <Form id="loginForm" onSubmit={this.submitForm}>
                    <FormGroup style={formGroup}>
                        <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    this.handleInputChange(e.target.id, e.target.value);
                                }}
                        />
                    </FormGroup>
                    <FormGroup style={formGroup}>
                        <Input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    this.handleInputChange(e.target.id, e.target.value);
                                }}
                        />
                    </FormGroup>
                    <Link style={linkFontSize} to="/forgot-password">Forgot Password?</Link>
                    <Button style={{width: '100%'}} disabled={isLoading} active={isLoading}>
                        {isLoading ? 'Please wait...' : 'Login'}
                    </Button>
                    <div>
                        <Link style={linkFontSize} to="/signup">
                            Don't have account? Sign up here
                        </Link>
                    </div>
                </Form>
            </SignupLoginContainer>
        );
    }
}

const formGroup: CSS = {
    textAlign: 'left',
};

const linkFontSize: CSS = {
    fontSize: '14px',
};