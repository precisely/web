jest.mock('./../../../constants/currentUser');

import * as React from 'react';
import * as Radium from 'radium';
import * as Adapter from 'enzyme-adapter-react-16';
import * as renderer from 'react-test-renderer';
import { ShallowWrapper, shallow, configure } from 'enzyme';
import { NavigationBar } from 'src/features/common/NavigationBar';
import { currentUser } from './../../../constants/currentUser';

configure({ adapter: new Adapter() });
Radium.TestMode.enable();

const map = {};
document.addEventListener = jest.fn((event, cb) => {
  map[event] = cb;
});

describe('Login tests Snapshot Testing :', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NavigationBar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Login Test After Login: ', () => {
  const componentTree: ShallowWrapper = shallow(<NavigationBar />);
  it('should render Log Out link in the navigation bar when the user is authenticated.', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });

  it('Checks if user is unaunthenticated', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });

  it('Checks if user is aunthenticated', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('.navbar-toggler-right').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG OUT');
  });

  it('Checks if user is aunthenticated', () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    componentTree.find('.navbar-toggler-right').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG OUT');
  });
});

describe('Login Test After Logout: ', () => {
  const componentTree: ShallowWrapper = shallow(<NavigationBar />);
  it('should render Log In link in the navigation bar when the user is unauthenticated.', () => {
    currentUser[`__mockLogoutFailureCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });

  it('Checks if user is unaunthenticated', () => {
    currentUser[`__mockLogoutFailureCase`]();
    componentTree.find('#loginStatus').simulate('click');
    expect(
      componentTree
        .find('#loginStatus')
        .children()
        .text()
    ).toEqual('LOG IN');
  });
});
