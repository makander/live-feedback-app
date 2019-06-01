/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GuestFeedback from "./GuestFeedback";

configure({adapter: new Adapter()});

describe('GuestFeedback', () => {
  
  test("renders", () => {
    const wrapper =shallow(<GuestFeedback />);
    expect(wrapper.exists()).toBe(true);
  });

});
