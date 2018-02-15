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
import {Button, Form, FormGroup, Input, FormText} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {SignupLoginContainer} from 'src/components/SignupLoginContainer';
import {getResetPasswordCode} from 'src/utils/cognito';
import {showAlert} from 'src/utils';

export interface IForgotPasswordState {
    email?: string;
    isLoading?: boolean;
}

@Radium
export class ForgotPassword extends React.Component<RouteComponentProps<void>, IForgotPasswordState> {

    toastId: number = null;

    state: IForgotPasswordState = {email: '', isLoading: false};

    updateLoadingState = (isLoading: boolean): void => {
        this.setState({isLoading});
    }

    onSuccess = (): void => {
        this.updateLoadingState(false);
        this.props.history.push(`/reset-password/${this.state.email}`);
    }

    onFailure = (message: string = 'Unable to process your request at this moment. Please try again later.'): void => {
        this.updateLoadingState(false);
        this.toastId = showAlert(this.toastId, message);
    }

    submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const {email} = this.state;

        if (!email) {
            this.toastId = showAlert(this.toastId, 'Please enter your email.');
            return;
        }

        this.updateLoadingState(true);
        getResetPasswordCode(email, this.onSuccess, this.onFailure);
    }

    handleInputChange(inputType: string, value: string): void {
        this.setState((): IForgotPasswordState => ({
            [inputType]: value,
        }));
    }

    render(): JSX.Element {
        const {isLoading, email} = this.state;

        return (
            <SignupLoginContainer>
                <Form onSubmit={this.submitForm}>
                    <FormGroup style={formGroup}>
                        <FormText color="muted">
                            Please enter the email you use for your account.<br/>
                            We will send a verification code on your email.
                        </FormText>
                        <Input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    this.handleInputChange(e.target.id, e.target.value);
                                }}
                        />
                    </FormGroup>
                    <Button color="success" style={{width: '100%'}} disabled={isLoading} active={isLoading}>
                        {isLoading ? 'Please wait...' : 'Submit'}
                    </Button>
                </Form>
            </SignupLoginContainer>
        );
    }
}

const formGroup: CSS = {
    textAlign: 'left',
};
