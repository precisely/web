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
import {isLoading, getUserData, getReportData} from 'src/containers/report/selectors';
import {store} from 'src/store';
import {setLoadingState, setReportData} from 'src/containers/report/actions';
import {ReportList, UserDataList, Report, ListItem} from 'src/containers/report/interfaces';
import {TemplateRenderer} from 'src/components/report/TemplateRenderer';

export interface GeneReportProps extends RouteComponentProps<void> {
  isLoading?: boolean;
  userData?: UserDataList;
  reportData?: ListItem<Report>[];
}

export class GeneReportImpl extends React.Component<GeneReportProps> {

  componentWillMount(): void {
    store.dispatch(setLoadingState());
  }

  renderReports = (): JSX.Element[] => {
    const {reportData, userData} = this.props;

    if (!reportData || !reportData.length) {
      return null;
    }

    return reportData.map((data: ListItem<Report>, index: number): JSX.Element => {
      return <TemplateRenderer parsedContent={data.attrs.parsed_content} userData={userData} key={index} />;
    });
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
export const GeneReportWithApollo = graphql<any, any>(GetReport, {
  options: () => ({
    // Dummy parameters to fetch the data. Will be removed in the next PR.
    variables: {slug: 'demo-slug-2', userId: 'user_id-1', vendorDataType: 'precisely:test'}
  }),
  props: (props: OptionProps<void, {report: ReportList}>): void => {
    if (props.data.report) {
      // storing the data in the redux for now.
      store.dispatch(setReportData(props.data.report));
    }
  }
})(GeneReportImpl);

const mapStateToProps: Selector<Map<string, Object>, {isLoading: boolean}> = createStructuredSelector({
  isLoading: isLoading(),
  userData: getUserData(),
  reportData: getReportData(),
});

export const GeneReport = connect(mapStateToProps)(GeneReportWithApollo);
