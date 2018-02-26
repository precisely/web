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
import {Button, Form, FormGroup, Input, Link, InputGroupAddon, InputGroup} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {PageContent} from 'src/components/PageContent';
import {login} from 'src/utils/cognito';
import {validateEmailAndPassword, showAlert} from 'src/utils';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {
    formButton,
    removeBorderRadius,
    noBorderTop,
    loginAndSignupPanel,
    header,
    inputStyle,
    alignCenter,
    formMargin,
} from 'src/constants/styleGuide';

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
            <div>
                <NavigationBar {...this.props} />
                <div className="mx-auto" style={loginAndSignupPanel}>
                    <h3 style={header}>Welcome back</h3>
                    <PageContent>
                        <Form id="loginForm" onSubmit={this.submitForm} style={formMargin}>
                            <FormGroup className="mb-0" style={alignCenter}>
                                <Input
                                        style={[removeBorderRadius, inputStyle]}
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <FormGroup style={alignCenter}>
                                <InputGroup style={inputStyle}>
                                    <Input
                                            style={passwordStyle}
                                            type="password"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                this.handleInputChange(e.target.id, e.target.value);
                                            }}
                                    />
                                    <InputGroupAddon style={inputAddon}>
                                        <Link style={linkFontSize} to="/forgot-password">Forgot Password?</Link>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                            <Button style={formButton} disabled={isLoading} active={isLoading}>
                                {isLoading ? 'Please wait...' : 'Login'}
                            </Button>
                        </Form>
                    </PageContent>
                    <div style={[linkFontSize, {textAlign: 'center'}]} className="mt-4">
                        Don't have account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const linkFontSize: CSS = {
    fontSize: '14px',
};

const passwordStyle: CSS = {
    ...noBorderTop,
    borderRight: 'none',
    ':focus': {
        borderColor: '#d9d9d9',
    }
};

const inputAddon: CSS = {
    ...noBorderTop,
    backgroundColor: '#fff',
};
