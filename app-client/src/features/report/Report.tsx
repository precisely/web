/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import { graphql, OptionProps } from 'react-apollo';

import {FileUpload} from 'src/features/common/FileUpload';
import {WhitePage} from 'src/features/common/WhitePage';
import {header, colors} from 'src/constants/styles';

import {GetReport} from './queries';
import {SmartReport} from './smart-report';
import { ReportData } from './interfaces';
import { LoadingPage } from 'src/features/common/LoadingPage';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { checkGraphQLData } from 'src/errors';
import { NetworkError } from '../../errors/display-error';
import { CTAOverlay } from './CTAOverlay';

export type ReportProps = OptionProps<any, {report: ReportData}>;
export interface ReportState {
  showUpload: boolean;
  ctaStatus?: string;
}

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
    return (
      <>
        <h1 className="mt-5 mb-4" style={header}>{report.title}</h1>
        <SmartReport elements={report.personalization.elements} />
      </>
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
        this.setState({ctaStatus: 'processing', showUpload: false });
      } else {
        // FIXME: show toast with error
      }
    };

    const centeredOverlayStyle: React.CSSProperties = {position: 'absolute', top: '50%', margin: 'auto', width: '100%'};

    if (this.state.showUpload) {
      return (
        <div style={{...centeredOverlayStyle, backgroundColor: 'white', height: '100%'}}>
          <FileUpload onFinish={fileUploadCallback}/>
        </div>
      );
    } else {
      return null;
    }
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
