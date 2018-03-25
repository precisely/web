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
import {Button, Form, FormGroup, Input} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {resetPassword} from 'src/utils/cognito';
import {utils} from 'src/utils';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {CSS} from 'src/interfaces';
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

export interface ResetPasswordState {
  verificationCode?: string;
  isLoading?: boolean;
  newPassword?: string;
  confirmPassword?: string;
}

@Radium
export class ResetPassword extends React.Component<RouteComponentProps<{email: string}>, ResetPasswordState> {

  toastId: number = null;

  state: ResetPasswordState = {verificationCode: '', isLoading: false, newPassword: '', confirmPassword: ''};

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
    this.toastId = utils.showAlert(this.toastId, 'Please login with your new password to continue.', 'success');
  }

  onFailure = (message: string = 'Unable to process your request at this moment. Please try again later.'): void => {
    this.updateLoadingState(false);
    this.toastId = utils.showAlert(this.toastId, message);
  }

  submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const {verificationCode, newPassword, confirmPassword} = this.state;

    if (newPassword !== confirmPassword) {
      this.toastId = utils.showAlert(this.toastId, 'Password does not match.');
      return;
    }

    this.updateLoadingState(true);

    // Not adding a null check for the email here, since it's already added in the componentWillMount method
    resetPassword(this.props.match.params.email, verificationCode, newPassword, this.onSuccess, this.onFailure);
  }

  handleInputChange(inputType: string, value: string): void {
    this.setState((): ResetPasswordState => ({
      [inputType]: value,
    }));
  }

  renderInput = (
      type: 'text' | 'password',
      id: string,
      placeholder: string,
      customStyle: CSS,
      className?: string
  ): JSX.Element => {
    return (
      <FormGroup style={alignCenter} className={className}>
        <Input
            style={[customStyle, inputStyle]}
            required
            type={type}
            id={id}
            placeholder={placeholder}
            value={this.state[id]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputChange(e.target.id, e.target.value);
            }}
        />
      </FormGroup>
    );
  }

  render(): JSX.Element {
    const {isLoading} = this.state;

    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="mx-auto" style={loginAndSignupPanel}>
          <h3 style={header}>Reset password</h3>
          <PageContent>
            <Form onSubmit={this.submitForm} style={formMargin}>
              {
                this.renderInput(
                    'text',
                    'verificationCode',
                    'Enter your verification code',
                    removeBorderRadius,
                    'mb-0'
                )
              }
              {
                this.renderInput(
                    'password',
                    'newPassword',
                    'Enter your new password',
                    noBorderTop,
                    'mb-0'
                )
              }
              {this.renderInput('password', 'confirmPassword', 'Re-enter your new password', noBorderTop)}
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
