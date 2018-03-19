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
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {GeneReportImpl, GeneReportProps, GeneReportWithApollo} from 'src/containers/report/GeneReport';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {PageContent} from 'src/components/PageContent';
import {Container} from 'src/components/ReusableComponents';
import {store} from 'src/store';
import {setLoadingState} from 'src/containers/report/actions';
import {ReportList} from 'src/containers/report/interfaces';
import {TemplateRenderer} from 'src/components/report/TemplateRenderer';
import {dummyData} from 'src/__tests__/src/containers/report/testData';

const createMockedNetworkFetch = require('apollo-mocknetworkinterface');

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

Radium.TestMode.enable();

describe('GeneReport tests.', () => {

  store.dispatch = jest.fn();

  describe('When the report data is loading.', () => {
    const componentTree: ShallowWrapper<GeneReportProps> = shallow(<GeneReportImpl isLoading={true} />);

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
        args: {props: GeneReportProps}
    ) => {
      const componentTree: ShallowWrapper<GeneReportProps> = shallow(<GeneReportImpl {...args.props} />);
      expect(componentTree.find(TemplateRenderer).length).toBe(0);
      done();
    }, [ // tslint:disable-next-line
      ['props'],
      [{isLoading: false}],
      [{isLoading: false, reportData: []}]
    ]);
  });

  describe('When the report data is present.', () => {
    it('It should not render the TemplateRendered', () => {
      const componentTree: ShallowWrapper<GeneReportProps> =
          shallow(<GeneReportImpl isLoading={false} reportData={dummyData.Items} />);
      expect(componentTree.find(TemplateRenderer).length).toBe(1);
    });
  });

  describe('When the component is wrapped with the graphql', () => {
    const createResponse = (): {data: {report: ReportList}} => ({data: {report: dummyData}});

    const mockedNetworkFetch = createMockedNetworkFetch(createResponse, {timeout: 1});

    const client = new ApolloClient({
      link: createHttpLink({uri: 'http://localhost:3000', fetch: mockedNetworkFetch}),
      cache: new InMemoryCache({addTypename: false}),
    });

    const componentTree: ReactWrapper = mount(
      <ApolloProvider client={client}>
        <GeneReportWithApollo/>
      </ApolloProvider>
    );

    it('should render the GeneReport data successfully.', () => {
      expect(componentTree.find(GeneReportImpl).length).toEqual(1);
    });

  });
});
