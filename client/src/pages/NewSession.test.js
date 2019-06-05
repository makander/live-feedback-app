/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NewSession from "./NewSession";

configure({adapter: new Adapter()});

describe('NewSession', () => {
  
  test("renders", () => {
    const wrapper =shallow(<NewSession />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
