import React from "react";
import  { configure, shallow } from "enzyme";
import PublicRoute from "./PublicRoute";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('PublicRoute', () => {
  
  test("renders", () => {
    const wrapper =shallow(<PublicRoute />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
