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
import {Button, Form, FormGroup, Input, Row, Col} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {PageContainer} from 'src/components/PageContainer';

const logo = require('src/assets/logo.png');

export interface ILoginAndSignupState {
    isLoginPage?: boolean;
    email?: string;
    password?: string;
    isLoading?: boolean;
    emailError?: string;
    passwordError?: string;
}

@Radium
export class LoginAndSignup extends React.Component<RouteComponentProps<void>, ILoginAndSignupState> {

    state = {
        email: '',
        password: '',
        isLoading: false,
        emailError: '',
        passwordError: '',
        isLoginPage: false,
    };

    componentWillMount(): void {
        const {pathname} = this.props.location;

        if (pathname.includes('login')) {
            this.setState((): ILoginAndSignupState => ({
                isLoginPage: true,
            }));
        }
    }

    updateErrorMessages = (emailError: string, passwordError: string): void => {
        this.setState((): ILoginAndSignupState => ({
            emailError, passwordError,
        }));
    }

    submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const {email, password} = this.state;
        const missingFieldMessage: string = 'This field is required.';

        if (!email.trim() && !password) {
            this.updateErrorMessages(missingFieldMessage, missingFieldMessage);
            return;
        }

        if (!email.trim()) {
            this.updateErrorMessages(missingFieldMessage, '');
            return;
        }

        if (!password) {
            this.updateErrorMessages('', missingFieldMessage);
            return;
        }

        if (password.length < 6) {
            this.updateErrorMessages('', 'The password length cannot be less than 6 characters.');
            return;
        }
    }

    handleInputChange(inputType: string, value: string): void {
        this.setState((): ILoginAndSignupState => ({
            [inputType]: value,
        }));
    }

    renderButtonText = (): string => {
        const {isLoginPage, isLoading} = this.state;

        if (isLoading) {
            return 'Please wait...';
        }

        return isLoginPage ? 'Login' : 'Signup';
    }

    render(): JSX.Element {
        const {isLoading, email, password, emailError, passwordError} = this.state;

        return (
            <PageContainer style={container}>
                <Row>
                    <Col xs={12} style={formColumn}>
                        <img style={logoStyle} src={logo} />
                        <Form onSubmit={this.submitForm}>
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
                                <span style={errorMessage}>{emailError}</span>
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
                                <span style={errorMessage}>{passwordError}</span>
                            </FormGroup>
                            <Button style={{width: '100%'}} disabled={isLoading}>
                                {this.renderButtonText()}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </PageContainer>
        );
    }
}

const container: CSS = {
    backgroundColor: '#F1F1F1',
    padding: 0,
};

const formColumn: CSS = {
    textAlign: 'center',
    padding: 0,
    '@media screen and (min-width: 600px)': {
        minWidth: '250px',
    }
};

const logoStyle: CSS = {
    height: '80px',
    marginBottom: '24px',
};

const formGroup: CSS = {
    textAlign: 'left',
};

const errorMessage: CSS = {
    color: 'red',
};
