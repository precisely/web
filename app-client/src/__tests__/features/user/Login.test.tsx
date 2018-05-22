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
import {RouteComponentProps} from 'react-router';
import {configure,shallow,ShallowWrapper} from 'enzyme';
import {Login} from 'src/features/user/Login';
import {currentUser} from 'src/constants/currentUser';
import {
  mockedHistory,
  mockedMatch,
  mockedLocation
} from 'src/__tests__/testSetup';

Radium.TestMode.enable();

configure({ adapter: new Adapter() });

describe('Login tests After Logging In :', () => {
    const componentTree: ShallowWrapper<RouteComponentProps<void>> = shallow(
        <Login
          history={mockedHistory}
          match={mockedMatch()}
          location={mockedLocation}
          staticContext={{}}
        />
    );

    it('it should not render the Login component if user is authenticated : ', () => {
      currentUser[`__mockisAuthenticatedSuccessCase`]();
      expect(componentTree.find(Login).length).toBe(0);
    });

    it('it should redirect if user is already logged in', () => {
      currentUser[`__mockisAuthenticatedSuccessCase`]();
      expect(mockedHistory.location.pathname).toEqual('demoPathName');
    });
});

describe('Login tests Snapshot Testing :', () => {
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
