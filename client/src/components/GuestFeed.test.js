import React from "react";
import  { configure, shallow } from "enzyme";
import GuestFeedback from "./GuestFeedback";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('GuestFeedback', () => {
  
  test("renders", () => {
    const wrapper =shallow(<GuestFeedback />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
