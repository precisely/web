/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
jest.mock('./../../constants/currentUser');
import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { ShallowWrapper, shallow, configure } from "enzyme";
import { Route, Redirect } from "react-router-dom";
import { AuthRoute } from "src/routes/AuthRoute";
import { currentUser } from "./../../constants/currentUser";

const unroll = require("unroll");
unroll.use(it);

configure({ adapter: new Adapter() });

describe("Tests for AuthRoute", () => {
  class DummyComponent extends React.Component {
    // tslint:disable-next-line
    constructor(props: any) {
      super(props);
    }
  }

  describe("When onEnter returns true", () => {
    currentUser[`__mockisAuthenticatedSuccessCase`]();
    const componentTree: ShallowWrapper = shallow(
      <AuthRoute path="/dummyPath" exact component={DummyComponent} />
    );

    it("should test for Route component", () => {
      expect(componentTree.find(Route).length).toBe(1);
    });
  });

  describe("When onEnter returns false", () => {
    const componentTree: ShallowWrapper = shallow(
      <AuthRoute path="/dummyPath" component={DummyComponent} />
    );

    it("should test for Redirect component", () => {
      expect(componentTree.find(Redirect).length).toBe(1);
    });
  });
});
