/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PrivateRoute from "./PrivateRoute";

configure({adapter: new Adapter()});

describe('PrivateRoute', () => {
  
  test("renders", () => {
    const wrapper =shallow(<PrivateRoute />);
    expect(wrapper.exists()).toBe(true);
  });

});
