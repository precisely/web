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
import {Button, Form, FormGroup, FormText} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {utils} from 'src/utils';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {Email} from 'src/features/common/Email';
import {currentUser} from 'src/constants/currentUser';
import {
  formButton,
  header,
  loginAndSignupPanel,
  alignCenter,
  formMargin,
} from 'src/constants/styleGuide';

export interface ForgotPasswordState {
  email?: string;
  isLoading?: boolean;
}

@Radium
export class ForgotPassword extends React.Component<RouteComponentProps<void>, ForgotPasswordState> {

  toastId: number = null;

  state: ForgotPasswordState = {email: '', isLoading: false};

  updateLoadingState = (isLoading: boolean): void => {
    this.setState({isLoading});
  }

  onSuccess = (): void => {
    this.updateLoadingState(false);
    this.props.history.push(`/reset-password/${this.state.email}`);
  }

  onFailure = (error: Error): void => {
    this.updateLoadingState(false);
    this.toastId = utils.showAlert(this.toastId, error.message);
  }

  submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const {email} = this.state;

    if (!email) {
      this.toastId = utils.showAlert(this.toastId, 'Please enter your email.');
      return;
    }

    this.updateLoadingState(true);
    currentUser.forgotPassword(email, this.onSuccess, this.onFailure);
  }
  
  handleInputChange(inputType: string, value: string): void {
    this.setState((): ForgotPasswordState => ({
      [inputType]: value,
    }));
  }

  render(): JSX.Element {
    const {isLoading, email} = this.state;

    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="mx-auto" style={loginAndSignupPanel}>
          <h3 style={header}>Forgot password</h3>
          <PageContent>
            <Form onSubmit={this.submitForm} style={formMargin}>
              <FormGroup style={alignCenter}>
                <FormText color="muted">
                  Please enter the email you use for your account.<br/>
                  We will send a verification code on your email.
                </FormText><br/>
                <Email
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                      this.handleInputChange(e.target.id, e.target.value);
                    }}
                />
              </FormGroup>
              <Button style={formButton} disabled={isLoading} active={isLoading}>
                {isLoading ? 'Please wait...' : 'Submit'}
              </Button>
            </Form>
          </PageContent>
        </div>
      </div>
    );
  }
}