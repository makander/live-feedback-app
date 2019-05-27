import React from "react";
import  { configure, shallow } from "enzyme";
import PrivateRoute from "./PrivateRoute";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('PrivateRoute', () => {
  
  test("renders", () => {
    const wrapper =shallow(<PrivateRoute />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
