import React from "react";
import  { configure, shallow } from "enzyme";
import Landing from "./Landing";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Landing', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Landing />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
