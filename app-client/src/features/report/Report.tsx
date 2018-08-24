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
import * as streams from 'memory-streams';
import { ReducibleElement, Renderer } from 'smart-report';

import {NavigationBar} from 'src/features/common/NavigationBar';
import {Container} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {header} from 'src/constants/styleGuide';
import * as AuthUtils from 'src/utils/auth';

import {GetReport} from './queries';
import {ReportData} from './interfaces';
import {SmartReport} from './smart-report';

export type ReportProps = OptionProps<void, {report: ReportData}> & RouteComponentProps<void>;

export class ReportImpl extends React.Component<ReportProps> {

  state = {isLoading: false};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  renderSmartReport = (): JSX.Element | string => {
    const {report} = this.props.data;
    const elements: ReducibleElement[] = JSON.parse(report.parsedContent);

    return <SmartReport elements={ elements } />;
  }

  render(): JSX.Element {
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>Report data</h1>
          <PageContent>
            { this.renderSmartReport() }
          </PageContent>
        </Container>
      </div>
    );
  }
}

export const Report = graphql<any, any>(GetReport, {
  options: () => ({
    // Dummy parameters to fetch the data. Will be removed in future.
    variables: {slug: 'mecfs'}
  })
})(ReportImpl);
