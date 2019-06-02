/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PublicRoute from "./PublicRoute";

configure({adapter: new Adapter()});

describe('PublicRoute', () => {
  
  test("renders", () => {
    const wrapper =shallow(<PublicRoute />);
    expect(wrapper.exists()).toBe(true);
  });

});
