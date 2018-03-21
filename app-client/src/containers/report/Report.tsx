/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {connect} from 'react-redux';
import {createStructuredSelector, Selector} from 'reselect';
import {graphql, OptionProps} from 'react-apollo';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {Container} from 'src/components/ReusableComponents';
import {PageContent} from 'src/components/PageContent';
import {header} from 'src/constants/styleGuide';
import {GetReport} from 'src/containers/report/queries';
import {isLoading, getReportData} from 'src/containers/report/selectors';
import {store} from 'src/store';
import {setLoadingState, setReportData} from 'src/containers/report/actions';
import {ReportData} from 'src/containers/report/interfaces';
import {MarkdownComponentRenderer} from 'src/components/report/MarkdownComponentRenderer';

export interface ReportProps extends RouteComponentProps<void> {
  isLoading?: boolean;
  reportData?: ReportData;
}

export class ReportImpl extends React.Component<ReportProps> {

  componentWillMount(): void {
    store.dispatch(setLoadingState());
  }

  renderReports = (): JSX.Element => {
    const {reportData} = this.props;

    if (!reportData || !reportData.parsedContent) {
      return <p>No reports found</p>;
    }

    return (
      <div>
        <h6>{reportData.title}</h6>
        <MarkdownComponentRenderer parsedContent={reportData.parsedContent} userData={reportData.userData} />
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
            {this.props.isLoading ? 'Fetching data. Please wait...' : this.renderReports()}
          </PageContent>
        </Container>
      </div>
    );
  }
}

// TODO Figure out correct types for the exported component.
// tslint:disable-next-line
export const ReportWithApollo = graphql<any, any>(GetReport, {
  options: () => ({
    // Dummy parameters to fetch the data. Will be removed in future.
    variables: {slug: 'dolorem-error-minima', vendorDataType: 'precisely:test'}
  }),
  props: (props: OptionProps<void, {report: ReportData}>): void => {
    if (props.data.report) {
      // storing the data in the redux for now.
      store.dispatch(setReportData(props.data.report));
    }
  }
})(ReportImpl);

const mapStateToProps: Selector<Map<string, Object>, {isLoading: boolean}> = createStructuredSelector({
  isLoading: isLoading(),
  reportData: getReportData(),
});

export const Report = connect(mapStateToProps)(ReportWithApollo);
