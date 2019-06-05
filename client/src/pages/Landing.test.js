/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Landing from "./Landing";

configure({adapter: new Adapter()});

describe('Landing', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Landing />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
