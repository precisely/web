/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, configure, EnzymePropSelector, mount, ReactWrapper} from 'enzyme';
import {ApolloProvider} from 'react-apollo';
import {ReportImpl, ReportProps, ReportWithApollo} from 'src/containers/report/Report';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {PageContent} from 'src/components/PageContent';
import {Container} from 'src/components/ReusableComponents';
import {store} from 'src/store';
import {setLoadingState} from 'src/containers/report/actions';
import {ReportData} from 'src/containers/report/interfaces';
import {MarkdownComponentRenderer} from 'src/components/report/MarkdownComponentRenderer';
import {dummyData} from 'src/__tests__/src/containers/report/testData';
import {getApolloClient} from 'src/__tests__/testSetup';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

Radium.TestMode.enable();

describe('Report tests.', () => {

  store.dispatch = jest.fn();

  describe('When the report data is loading.', () => {
    const componentTree: ShallowWrapper<ReportProps> = shallow(<ReportImpl isLoading={true} />);

    it('should dispatch an action to set the loading state before the component is mounted', () => {
      expect(store.dispatch).toHaveBeenCalledWith(setLoadingState());
    });

    unroll('it should display #count #elementName elements', (
      done: () => void,
      args: {elementName: string, element: EnzymePropSelector, count: number}
    ) => {
      expect(componentTree.find(args.element).length).toBe(args.count);
      done();
    }, [ // tslint:disable-next-line
      ['elementName', 'element', 'count'],
      ['NavigationBar', NavigationBar, 1],
      ['h1', 'h1', 1],
      ['Container', Container, 1],
      ['PageContent', PageContent, 1]
    ]);

    it('should display a loading message.', () => {
      expect(componentTree.contains('Fetching data. Please wait...')).toBe(true);
    });
  });

  describe('When the report data is not loading and the report data is not present.', () => {
    unroll('It should not render the TemplateRendered when the props are: #props', (
        done: () => void,
        args: {props: ReportProps}
    ) => {
      const componentTree: ShallowWrapper<ReportProps> = shallow(<ReportImpl {...args.props} />);
      expect(componentTree.find(MarkdownComponentRenderer).length).toBe(0);
      done();
    }, [ // tslint:disable-next-line
      ['props'],
      [{isLoading: false}],
      [{isLoading: false, reportData: []}]
    ]);
  });

  describe('When the report data is present.', () => {
    it('It should not render the MarkdownComponentRenderer', () => {
      const componentTree: ShallowWrapper<ReportProps> =
          shallow(<ReportImpl isLoading={false} reportData={dummyData} />);
      expect(componentTree.find(MarkdownComponentRenderer).length).toBe(1);
    });
  });

  describe('When the component is wrapped with the graphql', () => {
    const createResponse = (): {data: {report: ReportData}} => ({data: {report: dummyData}});

    const componentTree: ReactWrapper = mount(
      <ApolloProvider client={getApolloClient<{data: {report: ReportData}}>(createResponse)}>
        <ReportWithApollo/>
      </ApolloProvider>
    );

    it('should render the Report data successfully.', () => {
      expect(componentTree.find(ReportImpl).length).toEqual(1);
    });

  });
});
