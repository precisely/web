/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {graphql, OptionProps} from 'react-apollo';

import * as AuthUtils from 'src/utils/auth';

import {FileUpload} from 'src/features/common/FileUpload';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {Container} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {header} from 'src/constants/styleGuide';

import {GetReport} from './queries';
import {ReportData} from './interfaces';
import {SmartReport} from './smart-report';
import { LoadingPage } from 'src/features/common/LoadingPage';

export type ReportProps = OptionProps<void, {report: ReportData}> & RouteComponentProps<void>;

export class ReportImpl extends React.Component<ReportProps> {

  state = {isLoading: false};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  renderSmartReport = (): JSX.Element | string => {
    const {report} = this.props.data;
    return <SmartReport elements={report.personalization} />;
  }

  renderUploadScreen = (): JSX.Element | string => {
    return (
      <div>
        upload screen {AuthUtils.getUserName()}
        <FileUpload />
      </div>
    );
  }

  render(): JSX.Element {
    const report = this.props.data && this.props.data.report;
    const title = report ? report.title : 'Loading';
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>{title}</h1>
          <PageContent>
            {report ? this.renderSmartReport() : <LoadingPage/>}
          </PageContent>
        </Container>
      </div>
    );
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
