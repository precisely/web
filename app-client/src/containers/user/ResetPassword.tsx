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
import {Button, Form, FormGroup, Input} from 'src/components/ReusableComponents';
import {PageContent} from 'src/components/PageContent';
import {resetPassword} from 'src/utils/cognito';
import {showAlert} from 'src/utils';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {
    formButton,
    noBorderTop,
    removeBorderRadius,
    header,
    loginAndSignupPanel,
    inputStyle,
    alignCenter,
    formMargin,
} from 'src/constants/styleGuide';

export interface IResetPasswordState {
    verificationCode?: string;
    isLoading?: boolean;
    newPassword?: string;
    confirmPassword?: string;
}

@Radium
export class ResetPassword extends React.Component<RouteComponentProps<{email: string}>, IResetPasswordState> {

    toastId: number = null;

    state: IResetPasswordState = {verificationCode: '', isLoading: false, newPassword: '', confirmPassword: ''};

    componentWillMount(): void {
        const {match, history} = this.props;

        if (!match.params || !match.params.email) {
            history.push('/forgot-password');
        }
    }

    updateLoadingState = (isLoading: boolean): void => {
        this.setState({isLoading});
    }

    onSuccess = (): void => {
        this.updateLoadingState(false);
        this.props.history.push('/login');
        this.toastId = showAlert(this.toastId, 'Please login with your new password to continue.', 'success');
    }

    onFailure = (message: string = 'Unable to process your request at this moment. Please try again later.'): void => {
        this.updateLoadingState(false);
        this.toastId = showAlert(this.toastId, message);
    }

    submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const {verificationCode, newPassword, confirmPassword} = this.state;

        if (newPassword !== confirmPassword) {
            this.toastId = showAlert(this.toastId, 'Password does not match.');
            return;
        }

        this.updateLoadingState(true);

        // Not adding a null check for the email here, since it's already added in the componentWillMount method
        resetPassword(this.props.match.params.email, verificationCode, newPassword, this.onSuccess, this.onFailure);
    }

    handleInputChange(inputType: string, value: string): void {
        this.setState((): IResetPasswordState => ({
            [inputType]: value,
        }));
    }

    render(): JSX.Element {
        const {isLoading, verificationCode, newPassword, confirmPassword} = this.state;

        return (
            <div>
                <NavigationBar {...this.props} />
                <div className="mx-auto" style={loginAndSignupPanel}>
                    <h3 style={header}>Reset password</h3>
                    <PageContent>
                        <Form onSubmit={this.submitForm} style={formMargin}>
                            <FormGroup style={alignCenter} className="mb-0">
                                <Input
                                        style={[removeBorderRadius, inputStyle]}
                                        required
                                        type="text"
                                        id="verificationCode"
                                        placeholder="Enter your verification code"
                                        value={verificationCode}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <FormGroup style={alignCenter} className="mb-0">
                                <Input
                                        style={[noBorderTop, inputStyle]}
                                        required
                                        type="password"
                                        id="newPassword"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <FormGroup style={alignCenter}>
                                <Input
                                        style={[noBorderTop, inputStyle]}
                                        required
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Re-enter your new password"
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            this.handleInputChange(e.target.id, e.target.value);
                                        }}
                                />
                            </FormGroup>
                            <Button style={formButton} disabled={isLoading} active={isLoading}>
                                {isLoading ? 'Please wait...' : 'Reset Password'}
                            </Button>
                        </Form>
                    </PageContent>
                </div>
            </div>
        );
    }
}
