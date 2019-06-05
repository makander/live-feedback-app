/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MySessions from "./MySessions";

configure({adapter: new Adapter()});

describe('MySessions', () => {
  
  test("renders", () => {
    const wrapper =shallow(<MySessions />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
