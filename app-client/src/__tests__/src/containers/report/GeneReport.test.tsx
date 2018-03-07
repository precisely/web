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
import {ShallowWrapper, shallow, configure, EnzymePropSelector, mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import {GeneReportImpl, GeneReportProps} from 'src/containers/report/GeneReport';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {PageContent} from 'src/components/PageContent';
import {Container} from 'src/components/ReusableComponents';
import {store} from 'src/store';
import {setLoadingState} from 'src/containers/report/actions';
import {GetReport} from 'src/containers/report/queries';
import {dummyData} from 'src/__tests__/src/containers/report/testData';

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

  describe('When the report data is not loading.', () => {
    const componentTree: ShallowWrapper<GeneReportProps> = shallow(<GeneReportImpl isLoading={false} />);

    it('should display a loading message.', () => {
      expect(componentTree.contains('Data fetched.')).toBe(true);
    });
  });

  describe('When the ', () => {
    it('your test case message', async () => {
      const componentTree = mount(
        <MockedProvider
            mocks={[{
              request: {
                query: GetReport,
                variables: {
                  slug: 'demo',
                  userId: 'test-id',
                  vendorDataType: 'precisely:demo',
                  userDataLimit: 2,
                }
              },
              result: {
                data: {report: dummyData}
              },
            }]}
        >
          <GeneReportImpl isLoading={false} />
        </MockedProvider>
      );
      await new Promise(resolve => setTimeout(resolve));
      componentTree.update();
      console.log(`componentTree.find('GeneReportImpl')`, componentTree.props());
      
      expect(componentTree.find(GeneReportImpl).props().isLoading).toEqual(false);            
    });
  });
});
