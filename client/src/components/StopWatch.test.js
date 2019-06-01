/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import StopWatch from "./StopWatch";

configure({adapter: new Adapter()});

describe('StopWatch', () => {
  
  test("renders", () => {
    const wrapper =shallow(<StopWatch />);
    expect(wrapper.exists()).toBe(true);
  });

});
