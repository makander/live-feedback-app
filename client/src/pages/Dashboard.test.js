import React from "react";
import  { configure, shallow } from "enzyme";
import Dashboard from "./Dashboard";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Dashboard', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Dashboard />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
