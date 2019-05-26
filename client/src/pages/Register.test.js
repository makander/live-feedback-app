import React from "react";
import  { configure, shallow } from "enzyme";
import Register from "./Register";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe("Register", () => {
  
  test('renders', () => {
    const wrapper =shallow(<Register />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
