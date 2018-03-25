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
import {ReportImpl, ReportProps, Report} from 'src/features/report/Report';
import {NavigationBar} from 'src/features/common/NavigationBar';
import {PageContent} from 'src/features/common/PageContent';
import {Container} from 'src/features/common/ReusableComponents';
import {store} from 'src/store';
import {ReportData} from 'src/features/report/interfaces';
import {MarkdownComponentRenderer} from 'src/features/markdown/MarkdownComponentRenderer';
import {dummyData} from 'src/__tests__/src/features/report/testData';
import {mockedHistory, mockedMatch, mockedLocation} from 'src/__tests__/testSetup';

const createMockedNetworkFetch = require('apollo-mocknetworkinterface');

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

Radium.TestMode.enable();

describe('Report tests.', () => {

  store.dispatch = jest.fn();

  describe('When the report data is loading.', () => {
    const componentTree: ShallowWrapper<ReportProps> = shallow(
        <ReportImpl history={mockedHistory} match={mockedMatch()} location={mockedLocation} data={{loading: true}} />
    );

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

  describe('When the server responds with an error.', () => {
    const componentTree: ShallowWrapper<ReportProps> = shallow(
        <ReportImpl
            history={mockedHistory}
            match={mockedMatch()}
            location={mockedLocation}
            data={{error: 'A dummy error.', loading: false}}
        />
    );

    it('should display an error message.', () => {
      expect(componentTree.contains('Unable to fetch the reports.')).toBe(true);
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
      [{data: {}}],
      [{data: {report: []}}]
    ]);
  });

  describe('When the report data is present.', () => {
    it('It should not render the MarkdownComponentRenderer', () => {
      const componentTree: ShallowWrapper<ReportProps> = shallow(
          <ReportImpl
              data={{loading: false, ...dummyData}}
              history={mockedHistory}
              match={mockedMatch()}
              location={mockedLocation}
          />
      );
      expect(componentTree.find(MarkdownComponentRenderer).length).toBe(1);
    });
  });

  describe('When the component is wrapped with the graphql', () => {
    const createResponse = (): {data: {report: ReportData}} => ({data: dummyData});

    const mockedNetworkFetch = createMockedNetworkFetch(createResponse, {timeout: 1});

    const client = new ApolloClient({
      link: createHttpLink({uri: 'http://localhost:3000', fetch: mockedNetworkFetch}),
      cache: new InMemoryCache({addTypename: false}),
    });

    const componentTree: ReactWrapper = mount(
      <ApolloProvider client={client}>
        <Report/>
      </ApolloProvider>
    );

    it('should render the Report data successfully.', () => {
      expect(componentTree.find(ReportImpl).length).toEqual(1);
    });

  });
});
