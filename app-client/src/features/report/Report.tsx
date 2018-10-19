/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import { graphql, OptionProps } from 'react-apollo';

import * as AuthUtils from 'src/utils/auth';

import {FileUpload} from 'src/features/common/FileUpload';
import {WhitePage} from 'src/features/common/WhitePage';
import {header} from 'src/constants/styles';

import {GetReport} from './queries';
import {SmartReport} from './smart-report';
import { ReportData } from './interfaces';
import { LoadingPage } from 'src/features/common/LoadingPage';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { checkGraphQLData } from 'src/errors';
import { NetworkError } from '../../errors/display-error';

export type ReportProps = OptionProps & {report: ReportData};
export type ReportState = {isLoading: boolean};

export class ReportImpl extends React.Component<ReportProps, ReportState> {

  state = {isLoading: false};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  render(): JSX.Element {
    return (
      <NavigationPage>
        <WhitePage>
          {this.renderContent()}
        </WhitePage>
      </NavigationPage>
    );
  }

  renderSmartReport = (report: {title: string, personalization: any[]}): JSX.Element | string => {
    return (
      <>
        <h1 className="mt-5 mb-4" style={header}>{report.title}</h1>
        <SmartReport elements={report.personalization} />
      </>
    );
  }

  renderUploadScreen = (): JSX.Element | string => {
    return (
      <div>
        upload screen {AuthUtils.getUserName()}
        <FileUpload />
      </div>
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
