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
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

export type EditorProps = OptionProps<void, {reports: ReportData[]}> & RouteComponentProps<void>;

export class EditorImpl extends React.Component<EditorProps> {

  state = {isLoading: false, activeTab: 'draft'};

  componentWillMount(): void {
    this.setState({isLoading: true});
  }

  render(): JSX.Element {
    const report = this.props.data && this.props.data.reports;
    return (
      <div>
        <NavigationBar {...this.props}/>
        <Container className="mx-auto mt-5 mb-5">
          <h1 className="mt-5 mb-4" style={header}>Editor</h1>
          <PageContent>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <h4>Tab 1 Contents</h4>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="6">
                    <Card body={true}>
                      <CardTitle>Special Title Treatment</CardTitle>
                      <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                      <Button>Go somewhere</Button>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card body={true}>
                      <CardTitle>Special Title Treatment</CardTitle>
                      <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                      <Button>Go somewhere</Button>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
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
}`, {
  options: ({match}) => {
    return {
      // Dummy parameters to fetch the data. Will be removed in future.
      variables: {slug: match.params.slug}
    };
  }
})(EditorImpl);
