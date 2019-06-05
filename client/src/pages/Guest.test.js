/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Guest from "./Guest";

configure({adapter: new Adapter()});

describe('Guest', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Guest />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
