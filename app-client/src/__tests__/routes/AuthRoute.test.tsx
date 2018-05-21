/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.mock('src/constants/currentUser');

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper,shallow,configure,EnzymePropSelector} from 'enzyme';
import {Route, Redirect} from 'react-router-dom';
import {AuthRoute} from 'src/routes/AuthRoute';
import {currentUser} from 'src/constants/currentUser';

const unroll = require('unroll');
unroll.use(it);

configure({adapter:new Adapter()});

describe('Tests for AuthRoute', () => {


  class DummyComponent extends React.Component {
    // tslint:disable-next-line
    constructor(props: any) {
      super(props);
    }
  }

  const getComponentTree = (path: string, redirectPath?: string) => shallow(
    <AuthRoute path={path} exact component={DummyComponent} authenticatedRedirect={redirectPath}/>
  );

  unroll('It should render the #componentName when user is authenticated and the redirect path is #redirectPath.', (
      done: () => void,
      args: {component: EnzymePropSelector, componentName: string, redirectPath: string}
  ) => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    const componentTree: ShallowWrapper = getComponentTree('/dummyPath', args.redirectPath);
    expect(componentTree.find(args.component).length).toBe(1);
    done();
  }, [ // tslint:disable-next-line
      ['component', 'componentName', 'redirectPath'],
      [Route, 'Route', ''],
      [Redirect, 'Redirect', '/dashboard'],
  ]);

  describe('When the user is not authorized', () => {
    it('should redirect to the login page when the routeProps path contains "login"', () => {
      currentUser[`__mockisAuthenticatedFailureCase`]();
      const componentTree = getComponentTree('/login');
      expect(componentTree.find(Redirect).length).toBe(1);
    });

    it('should render the router component when the routeProps path contains an incorrect path', () => {
      currentUser[`__mockisAuthenticatedFailureCase`]();
      const componentTree = getComponentTree('login');
      expect(componentTree.find(Route).length).toBe(1);
    });
  });
});
