/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Register from "./Register";

configure({adapter: new Adapter()});

describe("Register", () => {
  
  test('renders', () => {
    const wrapper =shallow(<Register />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
