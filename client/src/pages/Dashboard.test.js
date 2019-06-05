/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Dashboard from "./Dashboard";

configure({adapter: new Adapter()});

describe('Dashboard', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Dashboard />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
