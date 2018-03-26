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
import {Button, Form, FormGroup, Input, Link} from 'src/features/common/ReusableComponents';
import {CSS} from 'src/interfaces';
import {PageContent} from 'src/features/common/PageContent';
import {currentUser} from 'src/constants/currentUser';
import {utils} from 'src/utils';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {
  formButton,
  removeBorderRadius,
  noBorderTop,
  header,
  loginAndSignupPanel,
  inputStyle,
  alignCenter,
  formMargin,
} from 'src/constants/styleGuide';

export interface SignupState {
  email?: string;
  password?: string;
  confirmPassword?: string;
  isLoading?: boolean;
}

@Radium
export class Signup extends React.Component<RouteComponentProps<void>, SignupState> {

  toastId: number = null;

  state: SignupState = {
    email: '',
    password: '',
    isLoading: false,
    confirmPassword: '',
  };

  updateLoadingState = (isLoading: boolean) => {
    this.setState({isLoading});
  }

  onSuccess = () => {
    this.updateLoadingState(false);
    this.props.history.push('/login');
    this.toastId = utils.showAlert(this.toastId, 'Please check your email to confirm your account.', 'success');
  }

  onFailure = (error: Error) => {
    this.updateLoadingState(false);
    this.toastId = utils.showAlert(this.toastId, error.message);
  }

  submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {email, password, confirmPassword} = this.state;

    const validationInfo: {isValid: boolean, toastId: number} =
        utils.checkEmailAndPassword(email, password, this.toastId);

    // This is needed to prevent multiple toast from getting rendered.
    this.toastId = validationInfo.toastId;

    if (validationInfo.isValid) {
      if (!confirmPassword) {
        this.toastId = utils.showAlert(this.toastId, 'Please confirm your password.');
        return;
      }

      if (password !== confirmPassword) {
        this.toastId = utils.showAlert(this.toastId, 'Password does not match the confirm password.');
        return;
      }

      this.updateLoadingState(true);
      currentUser.signup(email, password, this.onSuccess, this.onFailure);
    }
  }

  handleInputChange(inputType: string, value: string): void {
    this.setState((): SignupState => ({
      [inputType]: value,
    }));
  }

  renderInput = (
      type: 'email' | 'password',
      id: string,
      placeholder: string,
      customStyle: CSS,
      className?: string
  ): JSX.Element => {
    return (
      <FormGroup style={alignCenter} className={className}>
        <Input
            style={[customStyle, inputStyle]}
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
          <h3 style={header}>Sign Up</h3>
          <PageContent>
            <Form id="signupForm" onSubmit={this.submitForm} style={formMargin}>
              {this.renderInput('email', 'email', 'Email', removeBorderRadius, 'mb-0')}
              {this.renderInput('password', 'password', 'Password', removeBorderRadius, 'mb-0')}
              {this.renderInput('password', 'confirmPassword', 'Re-enter your password', noBorderTop)}
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

const linkFontSize: CSS = {
  fontSize: '14px',
};
