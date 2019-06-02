/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LiveSession from "./LiveSession";

configure({adapter: new Adapter()});

describe('LiveSession', () => {
  
  test("renders", () => {
    const wrapper =shallow(<LiveSession />);
    expect(wrapper.exists()).toBe(true);
  });

});
