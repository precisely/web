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
import gql from 'graphql-tag';

import {NavigationBar} from 'src/features/common/NavigationBar';
import {Container} from 'src/features/common/ReusableComponents';
import {PageContent} from 'src/features/common/PageContent';
import {header} from 'src/constants/styleGuide';

import {ReportData} from 'src/features/report/interfaces';

export type EditorProps = OptionProps<void, {reports: ReportData[]}> & RouteComponentProps<void>;

export class EditorImpl extends React.Component<EditorProps> {

  state = {isLoading: false};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  render(): JSX.Element {
    const report = this.props.data && this.props.data.reports;
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>{title}</h1>
          <PageContent>
            {report ? this.renderSmartReport() : 'Loading...'}
          </PageContent>
        </Container>
      </div>
    );
  }
}

export const Editor = graphql<any, any>(gql`
query listReports($ownerId: String, $state: String) {
  reports(state: $state, ownerId: $ownerId) {
    id slug title draftContent publishedContent state
  }
}, {
  options: ({match}) => {
    return {
      // Dummy parameters to fetch the data. Will be removed in future.
      variables: {slug: match.params.slug}
    };
  }
})(EditorImpl);
