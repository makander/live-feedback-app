import React from "react";
import  { configure, shallow } from "enzyme";
import Login from "./Login";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Login', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Login />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
