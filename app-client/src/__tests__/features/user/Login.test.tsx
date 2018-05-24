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
import * as Radium from 'radium';
import * as renderer from 'react-test-renderer';
import {configure, shallow} from 'enzyme';
import {Login} from 'src/features/user/Login';
import {currentUser} from 'src/constants/currentUser';
import {utils} from 'src/utils';
import {
  mockedHistory,
  mockedMatch,
  mockedLocation
} from 'src/__tests__/testSetup';

Radium.TestMode.enable();

configure({adapter: new Adapter()});

describe('Login tests', () => {
  const getComponentTree = () =>
    shallow(
      <Login
        history={mockedHistory}
        match={mockedMatch()}
        location={mockedLocation}
        staticContext={{}}
      />
    );

  describe('After Logging In :', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    utils.getLastPageBeforeLogin = jest.fn().mockReturnValue('dummyPath');
    getComponentTree();

    it('should call push method on mockedHistory if user is authenticated : ', () => {
      expect(mockedHistory.push).toBeCalledWith('dummyPath');
    });
  });

  describe('Snapshot Testing :', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(
          <Login
            history={mockedHistory}
            match={mockedMatch()}
            location={mockedLocation}
            staticContext={{}}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
