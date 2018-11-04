/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */


import * as React from 'react';
import Radium from 'radium';
import { graphql, OptionProps } from 'react-apollo';
import { toast } from 'react-toastify';

import * as Styles from 'src/constants/styles';
import {FileUpload} from 'src/features/common/FileUpload';
import {WhitePage} from 'src/features/common/WhitePage';
import {GetReport} from './queries';
import {SmartReport} from './smart-report';
import { ReportData } from './interfaces';
import { LoadingPage } from 'src/features/common/LoadingPage';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { checkGraphQLData } from 'src/errors';
import { NetworkError } from '../../errors/display-error';
import { CTAOverlay } from './CTAOverlay';
import { fonts } from '../../constants/styles';


export type ReportProps = OptionProps<any, {report: ReportData}>;
export interface ReportState {
  showUpload: boolean;
  ctaStatus?: string;
}


@Radium
export class ReportImpl extends React.Component<ReportProps, ReportState> {

  state: ReportState = { showUpload: false, ctaStatus: undefined};

  get ctaStatus() {
    return this.state.ctaStatus || (
      this.state.ctaStatus = this.props.data && this.props.data.report && this.props.data.report.personalization.status
    );
  }

  render(): JSX.Element {
    return (
      <>
        <NavigationPage>
          <WhitePage>
            {this.renderContent()}
            {this.renderUploadDialog()}
          </WhitePage>
        </NavigationPage>
        {this.renderCTA()}
      </>
    );
  }

  renderSmartReport(report: ReportData): JSX.Element | string {
    const subtitleStyle: React.CSSProperties = { ... fonts.helveticaThin, fontSize: 14 };
    const subtitle = report.subtitle ? <p style={subtitleStyle}>{report.subtitle}</p> : null;
    return (
      <div>
        <h1 style={reportHeaderStyle}>{report.title}</h1>
        {subtitle}
        <SmartReport elements={report.personalization.elements} />
      </div>
    );
  }

  renderCTA() {
    const status = this.ctaStatus;
    const showUpload = () => this.setState({showUpload: true});
    if (this.props.data.loading) {
      return null;
    }

    if (!status || status === 'error') {
      return (
        <CTAOverlay
          heading="Curious about your results?"
          subheading="Precise.ly provides personalized insights based on your genetics"
          action={<button onClick={showUpload}>Get Your Personalized Report</button>}
        />
      );
    } else if (status === 'processing') {
      return (
        <CTAOverlay
          heading="Your data is being processed"
          subheading="You'll receive an email when your report is ready"
        />
      );
    }

    return null;
  }

  renderUploadDialog() {
    const fileUploadCallback = (complete: boolean) => {
      if (complete) {
        toast.info('Upload successful!');
        this.setState({ctaStatus: 'processing', showUpload: false});
      } else {
        toast.error('Upload failed', { autoClose: false });
      }
    };
    return (
      <FileUpload isOpen={this.state.showUpload} onFinish={fileUploadCallback} />
    );
  }

  renderContent() {
    const {data}  = this.props;
    if (!data || data.loading) {
      return <LoadingPage/>;
    }

    checkGraphQLData(data);
    if (data.report) {
      return this.renderSmartReport(data.report);
    } else {
      throw new NetworkError({ description: 'Unable to retrieve report'});
    }
  }

}


export const Report = graphql<any, any>(GetReport, {
  options: ({match}) => {
    return {
      // Dummy parameters to fetch the data. Will be removed in future.
      variables: {slug: match.params.slug}
    };
  }
})(ReportImpl);


const reportHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '48px',
  color: Styles.colors.defaultTextColor,
  fontSize: '40px',
  fontWeight: 300
};
