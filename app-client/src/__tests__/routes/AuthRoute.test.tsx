/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/constants/currentUser');

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, configure, EnzymePropSelector} from 'enzyme';
import {Route, Redirect} from 'react-router-dom';
import {AuthRoute} from 'src/routes/AuthRoute';
import {currentUser} from 'src/constants/currentUser';

const unroll = require('unroll');
unroll.use(it);

configure({adapter: new Adapter()});

describe('Tests for AuthRoute', () => {

  class DummyComponent extends React.Component {
    // tslint:disable-next-line
    constructor(props: any) {
      super(props);
    }
  }

  unroll(
    'The route should #result if authentication #isAuthenticated',
    (
      done: () => void,
      testArgs: {mock: string, component: React.Component}
    ) => {
      currentUser[testArgs.mock]();
      const componentTree = shallow(
        <AuthRoute path="/dummy" exact component={DummyComponent} />
      );

      expect(componentTree.find(testArgs.component).length).toBe(1);
      done();
    },
    [
      ['mock', 'component', 'result', 'isAuthenticated'],
      ['__mockisAuthenticatedSuccessCase', Route, 'render', 'passes'],
      ['__mockisAuthenticatedFailureCase', Redirect, 'redirect', 'fails']
    ]
  );
});
