import * as Adapter from 'enzyme-adapter-react-16';
import * as Auth0 from 'auth0-js';
import * as AuthUtils from 'src/utils/auth';
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { Login } from 'src/features/user/Login';
import { MemoryRouter } from 'react-router-dom';


Enzyme.configure({ adapter: new Adapter() });


describe('basic login component behavior', () => {

  const envSaved = process.env;

  beforeAll(() => {
    process.env = { ...envSaved };
    process.env['REACT_APP_AUTH0_CLIENT_ID'] = 'hello';
  });

  afterAll(() => {
    process.env = envSaved;
  });

  // NB: This test sucks, as it does not exercise any of the tricky bits of
  // login flow. A better test requires a full browser.

  let spyAuthorize: any;
  let spyParseHash: any;

  beforeEach(() => {
    spyAuthorize = jest.spyOn(Auth0.WebAuth.prototype, 'authorize').mockImplementation(() => {});
    spyParseHash = jest.spyOn(Auth0.WebAuth.prototype, 'parseHash');
  });

  afterEach(() => {
    spyParseHash.mockRestore();
    spyAuthorize.mockRestore();
  });

  it('calls Auth0 Universal Login when there is no logged-in user', () => {
    Enzyme.render(
      <MemoryRouter>
        <Login location={{}} />
      </MemoryRouter>
    );
    expect(spyAuthorize).toHaveBeenCalled();
    expect(spyParseHash).not.toHaveBeenCalled();
  });

  it('interprets the hash Auth0 adds to the callback URL after an authentication attempt', () => {
    // After an authentication attempt, Auth0 calls back to the application,
    // this time with a hash added to the parameter, e.g.,
    // /login#access_token=<long token string>. The Auth0 API provides a method,
    // parseHash, for interpreting this hash, and we're supposed to call it
    // after an authentication attempt to determine user credentials.
    Enzyme.render(
      <MemoryRouter>
        <Login location={{hash: '#access_token'}} />
      </MemoryRouter>
    );
    expect(spyAuthorize).not.toHaveBeenCalled();
    expect(spyParseHash).toHaveBeenCalled();
  });

  it('makes no Auth0 calls when there is a logged-in uiser', () => {
    AuthUtils.saveAuthentication({expiresIn: 60, accessToken: 'one', idToken: 'two'}, {});
    Enzyme.render(
      <MemoryRouter>
        <Login location={{}} />
      </MemoryRouter>
    );
    expect(spyAuthorize).not.toHaveBeenCalled();
    expect(spyParseHash).not.toHaveBeenCalled();
  });

});
