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
import {NavigationBar} from 'src/features/common/NavigationBar';
import {Container} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {header} from 'src/constants/styleGuide';
import {GetReport} from 'src/features/report/queries';
import {ReportData} from 'src/features/report/interfaces';
import {MarkdownComponentRenderer} from 'src/features/markdown/MarkdownComponentRenderer';

export interface ReportProps extends RouteComponentProps<void> {
  data?: {
    report: ReportData
  };
}

export interface ReportState {
  isLoading?: boolean;
}

export class ReportImpl extends React.Component<ReportProps, ReportState> {

  state = {isLoading: false};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  renderReports = (): JSX.Element | string => {
    const {data} = this.props;

    if (!data) {
      return 'Fetching data. Please wait...';
    }

    if (!data.report || !data.report.parsedContent) {
      return <p>No reports found</p>;
    }

    return (
      <div>
        <h6>{data.report.title}</h6>
        <MarkdownComponentRenderer parsedContent={data.report.parsedContent} userData={data.report.userData} />
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>Report data</h1>
          <PageContent>
            {this.renderReports()}
          </PageContent>
        </Container>
      </div>
    );
  }
}

// TODO Figure out correct types for the exported component.
// tslint:disable-next-line
export const Report = graphql<any, any>(GetReport, {
  options: () => ({
    // Dummy parameters to fetch the data. Will be removed in future.
    variables: {slug: 'dolorem-error-minima'}
  }),
  props: (props: OptionProps<void, {report: ReportData}>): void => {
    if (props.data.report) {
      // storing the data in the redux for now.
      // store.dispatch(setReportData(props.data.report));
    }
  }
})(ReportImpl);
